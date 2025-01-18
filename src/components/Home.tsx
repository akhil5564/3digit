import React, { FC, useEffect, useRef, useState } from 'react';
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
    const [firstInput, setFirstInput] = useState(''); // First input (number)
    const [secondInput, setSecondInput] = useState(''); // Second input (count)
    const [radioValue, setRadioValue] = useState('super'); // Default radio button value
    const [saveMessage, setSaveMessage] = useState(''); // Success message for saving
    const [dataList, setDataList] = useState<DataType[]>([]); // List of data
    const [isSaving, setIsSaving] = useState(false); // State to track saving status

    const secondInputRef = useRef<HTMLInputElement>(null); // Reference for the second input
    const firstInputRef = useRef<HTMLInputElement>(null); // Reference for the first input (number)

    // Disable scrolling on mount and re-enable it on unmount
    useEffect(() => {
        // Disable scrolling when on the Home page
        document.body.style.overflow = 'hidden';
        
        // Cleanup function to restore scrolling when component is unmounted
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    // Handle Add button click
    const handleAdd = async () => {
        // Check if all required inputs are valid
        if (firstInput.length !== 3 || secondInput.length === 0 || radioValue === '') {
            setSaveMessage("Please enter valid inputs.");
            setTimeout(() => setSaveMessage(''), 3000);  // Clear message after 3 seconds
            return;
        }
    
        // Convert the second input to a number
        const newCount = Number(secondInput);
    
        try {
            // Check if the number exists in the database
            const existingCountResponse = await getNumberCountFromDb(firstInput);  // Assume this is the API call
    
            if (existingCountResponse && existingCountResponse.status === 200) {
                const { count, number } = existingCountResponse.data;
    
                // Calculate the total count after adding the new count
                const totalCount = Number(count) + newCount;
                const balance = 5 - totalCount + newCount;

                // Check if the total count exceeds the limit (e.g., 5)
                if (totalCount > 5) {
                    setSaveMessage(`Blocked: ${number} (${balance})`);
                    setTimeout(() => setSaveMessage(''), 3000);  // Clear message after 3 seconds
                    return;
                }
    
                // Update the data list
                const updatedDataList = dataList.map(item => {
                    if (item.number === firstInput) {
                        return { ...item, count: (Number(item.count) + newCount).toString() }; // Update the count for the existing number
                    }
                    return item;
                });
    
                setDataList(updatedDataList); // Update the dataList state
    
                // If no existing data, create a new entry for the table
                if (!updatedDataList.some(item => item.number === firstInput)) {
                    const newData: DataType = {
                        number: firstInput,
                        count: secondInput,
                        type: radioValue,
                    };
                    setDataList([...dataList, newData]); // Add the new entry to the data list
                }
            } else {
                // Handle case where number doesn't exist in DB
                setSaveMessage(existingCountResponse.data.message);
                setTimeout(() => setSaveMessage(''), 3000);  // Clear message after 3 seconds
    
                // If no existing data, create a new entry for the table
                const newData: DataType = {
                    number: firstInput,
                    count: secondInput,
                    type: radioValue,
                };
                setDataList([...dataList, newData]); // Add the new entry to the data list
    
                setSaveMessage(``);
                setTimeout(() => setSaveMessage(''), 3000);  // Clear message after 3 seconds
            }
        } catch (error) {
            console.error('Error checking number count in the database:', error);
            setSaveMessage('Error: Count not fetched from the database.');
            setTimeout(() => setSaveMessage(''), 3000);  // Clear message after 3 seconds
        }
    
        // Clear the input fields after adding
        setFirstInput('');
        setSecondInput('');
        setRadioValue('super');
    
        // Focus back on the number input after Add button click
        if (firstInputRef.current) {
            firstInputRef.current.focus(); // Focus on the number input field
        }
    };

    // Handle Save button click
    const handleSave = async () => {
        const totalCount = dataList.reduce((sum, data) => sum + Number(data.count), 0);

        // Check if the sum exceeds the allowed limit of 5
        if (totalCount > 100) {
            // Prevent saving if the sum exceeds the limit
            setSaveMessage('Error: The sum of counts exceeds the allowed limit of 5.');
            setTimeout(() => setSaveMessage(''), 3000);  // Clear message after 3 seconds
            return;
        }

        // Disable the Save button while saving
        setIsSaving(true);

        try {
            const result: any = await reportData(dataList); // Send data to backend

            if (result.status === 200) {
                // Show success message and clear other messages
                setSaveMessage('Data saved successfully!');
                setDataList([]); // Clear dataList after saving
            } else if (result.status === 400) {
                // If the server returns 400, handle the error (limit exceeded)
                setSaveMessage('Error: The sum of counts exceeds the allowed limit of 5.');
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
                    ref={firstInputRef} // Attach ref to the number input
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

            {/* Display save message */}
            {saveMessage && <p className="save-message">{saveMessage}</p>}

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
