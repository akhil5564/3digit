import React, { FC, useRef, useState } from 'react';
import './home.css';
import { IconTrash } from '@tabler/icons-react';
import { reportData, getNumberCountFromDb } from '../services/allApi'; // Assuming getNumberCountFromDb is the API call to check the number in DB

interface DataType {
    number: string;
    count: string;
    type: string;
}

interface HomeProps { }

const Home: FC<HomeProps> = () => {
    const [firstInput, setFirstInput] = useState('');
    const [secondInput, setSecondInput] = useState('');
    const [radioValue, setRadioValue] = useState('super'); // Default radio button value
    const [saveMessage, setSaveMessage] = useState('');
    const [dataList, setDataList] = useState<DataType[]>([]); // Type for the list of entered data
    const [isSaving, setIsSaving] = useState(false); // State to track saving status
    const [errorMessage, setErrorMessage] = useState(''); // Error message for invalid data
    const [blockMessage, setBlockMessage] = useState(''); // Message when number is blocked due to count == 5

    const secondInputRef = useRef<HTMLInputElement>(null); // Reference for the second input

    // Handle Add button click
    const handleAdd = async () => {
        // Check if all required inputs are valid
        if (firstInput.length !== 3 || secondInput.length === 0 || radioValue === '') {
            alert("Please enter valid inputs.");
            return;
        }

        // Convert the second input to number
        const newCount = Number(secondInput);

        try {
            // Check if the number exists in the database
            const existingCountResponse = await getNumberCountFromDb(firstInput);  // Assume this returns the current count of the number

            if (-existingCountResponse) {
                const existingCount = Number(existingCountResponse); // Ensure `existingCountResponse.count` is a valid number

                const totalCount = existingCount + newCount;

                if (totalCount > 5) {
                    // If the sum exceeds 5, show a message and do not add
                    setBlockMessage(`The total count for number ${firstInput} exceeds the allowed limit of 5. Total: ${totalCount}`);
                    return;
                }

                // If it doesn't exceed, proceed to add the new count to the existing number
                const updatedDataList = dataList.map(item => {
                    if (item.number === firstInput) {
                        return { ...item, count: (existingCount + newCount).toString() }; // Update the count for the existing number
                    }
                    return item;
                });
                setDataList(updatedDataList);
            } else {
                // If the number doesn't exist in the database, add the new number
                const newData = { number: firstInput, count: secondInput, type: radioValue };
                setDataList(prevDataList => [...prevDataList, newData]);
            }
        } catch (error) {
            console.error('Error checking number count in the database:', error);
            setErrorMessage('Error checking the number in the database.');
        }

        // Clear the input fields
        setFirstInput('');
        setSecondInput('');
        setRadioValue('super');
        setBlockMessage(''); // Clear any previous block message
    };

    const handleSave = async () => {
        const totalCount = dataList.reduce((sum, data) => sum + Number(data.count), 0);

        // Check if the sum exceeds the allowed limit of 5
        if (totalCount > 5) {
            // Get the number of the first input (or any specific number from the data)

            // Set the error message with the number and total count
            setErrorMessage(`The sum of counts exceeds the allowed limit of 5. Number: , Total: ${totalCount}`);
            return; // Prevent saving if the sum exceeds the limit
        }

        // Disable the Save button while saving
        setIsSaving(true);

        try {
            const result: any = await reportData(dataList); // Send data to backend

            if (result.status === 200) {
                // Show success message
                setSaveMessage('Data saved successfully!');
                setDataList([]); // Clear dataList after saving
            } else if (result.response && result.response.status === 400) {
                // If the server returns 400, display the error message (limit exceeded)
                const limitErrorMessage = result.response.data.message || 'Error: The sum of counts exceeds the allowed limit of 5.';
                setErrorMessage(limitErrorMessage);
            }
        } catch (error) {
            console.log(error);
            setSaveMessage('Error saving data');
        } finally {
            // Reset state and show message for 3 seconds
            setFirstInput('');
            setSecondInput('');
            setRadioValue('super');
            setIsSaving(false);

            setTimeout(() => {
                setSaveMessage('');
            }, 3000);
        }
    };

    // Handle first input change (max length 3 digits)
    const handleFirstInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value.length <= 3) {
            setFirstInput(value);

            if (value.length === 3 && secondInputRef.current) {
                secondInputRef.current.focus();
            }
        }
    };

    // Handle second input change
    const handleSecondInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSecondInput(value);
    };

    // Handle radio button change
    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRadioValue(e.target.value);
    };

    // Handle delete item
    const handleDelete = (number: string) => {
        // Filter out the item with the specified number
        const updatedDataList = dataList.filter(item => item.number !== number);
        setDataList(updatedDataList);
    };

    return (
        <div className='home'>
            <div className='inputs'>
                <input
                    type="number"
                    placeholder='Number'
                    value={firstInput}
                    maxLength={3}
                    onChange={handleFirstInputChange}
                />
                <input
                    type="number"
                    placeholder="Count"
                    value={secondInput}
                    ref={secondInputRef}
                    onChange={handleSecondInputChange}
                />
            </div>

            <div className='radio'>
                <div>
                    <input
                        type="radio"
                        name="inlineRadioOptions"
                        value="super"
                        checked={radioValue === "super"}
                        onChange={handleRadioChange}
                    />
                    <label htmlFor="inlineRadio1">Super</label>
                </div>
                <div>
                    <input
                        type="radio"
                        name="inlineRadioOptions"
                        value="box"
                        checked={radioValue === "box"}
                        onChange={handleRadioChange}
                    />
                    <label htmlFor="inlineRadio2">Box</label>
                </div>
            </div>

            <div>
                <div className='btns'>
                    <button onClick={handleAdd}>Add</button>
                    <button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Display block message if count == 5 */}
            {blockMessage && <p className="block-message" style={{ color: 'red' }}>{blockMessage}</p>}

            {/* Display error or success message */}
            {saveMessage && <p className="save-message">{saveMessage}</p>}
            {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}

            {/* Table to display the added data */}
            {dataList.length > 0 && (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Count</th>
                            <th>Type</th>
                            <th>Action</th> {/* Added column for delete action */}
                        </tr>
                    </thead>
                    <tbody>
                        {dataList.map((data, index) => (
                            <tr key={index}>
                                <td>{data.number}</td>
                                <td>{data.count}</td>
                                <td>{data.type}</td>
                                <td>
                                    <button className='delete' onClick={() => handleDelete(data.number)}><IconTrash stroke={2} /></button>
                                </td> {/* Delete button */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Home;
