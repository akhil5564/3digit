import React, { FC, useRef, useState } from 'react';
import './home.css';
import { reportData } from '../services/allApi';

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

    const secondInputRef = useRef<HTMLInputElement>(null); // Reference for the second input

    // Handle save data to backend
    const handleSave = async () => {
        if (firstInput.length !== 3 || secondInput.length === 0 || radioValue === '') {
            alert("Please enter valid inputs.");
            return;
        }

        const data = { number: firstInput, count: secondInput, type: radioValue };

        // Disable the Save button while saving
        setIsSaving(true);
        
        try {
            const result = await reportData(data);
            console.log(result);

            // Show success message
            setSaveMessage('Data saved successfully!');
        } catch (error) {
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

    // Handle Add button click
    const handleAdd = () => {
        if (firstInput.length !== 3 || secondInput.length === 0 || radioValue === '') {
            alert("Please enter valid inputs.");
            return;
        }

        const newData = { number: firstInput, count: secondInput, type: radioValue };
        setDataList((prevDataList) => [...prevDataList, newData]);

        // Clear inputs after adding
        setFirstInput('');
        setSecondInput('');
        setRadioValue('super');
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

            {saveMessage && <p className="save-message">{saveMessage}</p>}

            {/* Table to display the added data */}
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
    );
};

export default Home;    
