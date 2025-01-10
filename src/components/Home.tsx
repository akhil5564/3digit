import React, { FC, useRef, useState } from 'react';
import './home.css';

interface HomeProps {}

const Home: FC<HomeProps> = () => {
    const [firstInput, setFirstInput] = useState('');
    const [secondInput, setSecondInput] = useState('');
    const [radioValue, setRadioValue] = useState('super'); // Set default radio button value to "super"
    const [saveMessage, setSaveMessage] = useState('');
    const [dataList, setDataList] = useState<any[]>([]); // To store entered data

    const handleSave = () => {
        // Validate input
        if (firstInput.length !== 3 || secondInput.length === 0 || radioValue === '') {
            alert("Please enter valid inputs.");
            return;
        }

        // Create the object you want to store
        const data = { number: firstInput, count: secondInput, type: radioValue };

        // Convert the object to a string before storing it in sessionStorage
        sessionStorage.setItem("data", JSON.stringify(data));

        // Clear inputs and show confirmation message
        setFirstInput('');
        setSecondInput('');
        setRadioValue('super');  // Reset to default "super" radio button selection
        setSaveMessage('Data saved successfully!');

        setTimeout(() => {
            setSaveMessage('');  // Hide message after 3 seconds
        }, 3000);
    };

    const secondInputRef = useRef<HTMLInputElement>(null); // Reference for the second input

    // Handle change for the first input
    const handleFirstInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Set the value for the first input (max 3 digits)
        if (value.length <= 3) {
            setFirstInput(value);

            // If length reaches 3, focus on the second input
            if (value.length === 3 && secondInputRef.current) {
                secondInputRef.current.focus();
            }
        }
    };

    const handleSecondInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSecondInput(value);
    };

    // Handle radio button change
    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRadioValue(e.target.value);
    };

    // Handle Add button click
    const handleAdd = () => {
        // Validate inputs again before adding to the list
        if (firstInput.length !== 3 || secondInput.length === 0 || radioValue === '') {
            alert("Please enter valid inputs.");
            return;
        }

        // Add data to the list
        const newData = { number: firstInput, count: secondInput, type: radioValue };
        setDataList((prevDataList) => [...prevDataList, newData]);

        // Clear inputs after adding
        setFirstInput('');
        setSecondInput('');
        setRadioValue('super'); // Reset to default "super" radio button selection
    };

    return (
        <>
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

                <div className='radio '>
                    <div className="">
                        <input
                            // className="form-check-input"
                            type="radio"
                            name="inlineRadioOptions"
                            id="inlineRadio1"
                            value="super"
                            checked={radioValue === "super"}
                            onChange={handleRadioChange}
                        />
                        <label className="form-check-label" htmlFor="inlineRadio1">Super</label>
                    </div>
                    <div className=" ">
                        <input
                            type="radio"
                            name="inlineRadioOptions"
                            id="inlineRadio2"
                            value="box"
                            checked={radioValue === "box"}
                            onChange={handleRadioChange}
                        />
                        <label className="form-check-label" htmlFor="inlineRadio2">Box</label>
                    </div>
                </div>
                <div>
                <button onClick={handleSave}>Save</button>
                <button onClick={handleAdd}>Add</button>
                </div>

                {/* Display confirmation message */}
                {saveMessage && <p className="save-message">{saveMessage}</p>}

                {/* Display the list of entered data in a table */}
                {dataList.length > 0 && (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Number</th>
                                <th>Count</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataList.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.number}</td>
                                    <td>{data.count}</td>
                                    <td>{data.type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

export default Home;
