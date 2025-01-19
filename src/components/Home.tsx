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
    const [firstInput, setFirstInput] = useState(''); 
    const [secondInput, setSecondInput] = useState('');
    const [radioValue, setRadioValue] = useState('super'); 
    const [saveMessage, setSaveMessage] = useState('');
    const [dataList, setDataList] = useState<DataType[]>([]); 
    const [isSaving, setIsSaving] = useState(false);

    const secondInputRef = useRef<HTMLInputElement>(null); 
    const firstInputRef = useRef<HTMLInputElement>(null);

    // UseEffect to load data from localStorage
    useEffect(() => {
        // Retrieve the data from localStorage when the component mounts
        const storedDataList = localStorage.getItem('dataList');
        if (storedDataList) {
            setDataList(JSON.parse(storedDataList));
        }

        // Retrieve other states from localStorage
        const storedFirstInput = localStorage.getItem('firstInput');
        if (storedFirstInput) {
            setFirstInput(storedFirstInput);
        }

        const storedSecondInput = localStorage.getItem('secondInput');
        if (storedSecondInput) {
            setSecondInput(storedSecondInput);
        }

        const storedRadioValue = localStorage.getItem('radioValue');
        if (storedRadioValue) {
            setRadioValue(storedRadioValue);
        }

        // Disable scrolling when on the Home page
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    // Save the state to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('dataList', JSON.stringify(dataList));
        localStorage.setItem('firstInput', firstInput);
        localStorage.setItem('secondInput', secondInput);
        localStorage.setItem('radioValue', radioValue);
    }, [dataList, firstInput, secondInput, radioValue]);

    const handleAdd = async () => {
        if (firstInput.length !== 3 || secondInput.length === 0 || radioValue === '') {
            setSaveMessage("Please enter valid inputs.");
            setTimeout(() => setSaveMessage(''), 3000); 
            return;
        }

        const newCount = Number(secondInput);

        try {
            const existingCountResponse = await getNumberCountFromDb(firstInput);

            if (existingCountResponse && existingCountResponse.status === 200) {
                const { count, number } = existingCountResponse.data;
                const totalCount = Number(count) + newCount;
                const balance = 5 - totalCount + newCount;

                if (totalCount > 5) {
                    setSaveMessage(`Blocked: ${number} (${balance})`);
                    setTimeout(() => setSaveMessage(''), 3000);  
                    return;
                }

                const updatedDataList = dataList.map(item => {
                    if (item.number === firstInput) {
                        return { ...item, count: (Number(item.count) + newCount).toString() };
                    }
                    return item;
                });

                setDataList(updatedDataList);

                if (!updatedDataList.some(item => item.number === firstInput)) {
                    const newData: DataType = {
                        number: firstInput,
                        count: secondInput,
                        type: radioValue,
                    };
                    setDataList([...dataList, newData]);
                }
            } else {
                setSaveMessage(existingCountResponse.data.message);
                setTimeout(() => setSaveMessage(''), 3000);

                const newData: DataType = {
                    number: firstInput,
                    count: secondInput,
                    type: radioValue,
                };
                setDataList([...dataList, newData]);

                setSaveMessage('');
                setTimeout(() => setSaveMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error checking number count in the database:', error);
            setSaveMessage('Error: Count not fetched from the database.');
            setTimeout(() => setSaveMessage(''), 3000);
        }

        setFirstInput('');
        setSecondInput('');
        setRadioValue('super');

        if (firstInputRef.current) {
            firstInputRef.current.focus();
        }
    };

    const handleSave = async () => {
        const totalCount = dataList.reduce((sum, data) => sum + Number(data.count), 0);

        if (totalCount > 100) {
            setSaveMessage('Error: The sum of counts exceeds the allowed limit of 5.');
            setTimeout(() => setSaveMessage(''), 3000); 
            return;
        }

        setIsSaving(true);

        try {
            const result: any = await reportData(dataList);

            if (result.status === 200) {
                setSaveMessage('Data saved successfully!');
                setDataList([]);
            } else if (result.status === 400) {
                setSaveMessage('Error: The sum of counts exceeds the allowed limit of 5.');
            }
        } catch (error) {
            console.log(error);
            setSaveMessage('Error saving data');
        } finally {
            setFirstInput('');
            setSecondInput('');
            setRadioValue('super');
            setIsSaving(false);

            setTimeout(() => {
                setSaveMessage('');
            }, 3000);
        }
    };

    const handleFirstInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value.length <= 3) {
            setFirstInput(value);

            if (value.length === 3 && secondInputRef.current) {
                secondInputRef.current.focus();
            }
        }
    };

    const handleSecondInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSecondInput(value);
    };

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRadioValue(e.target.value);
    };

    const handleDelete = (number: string) => {
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
                    ref={firstInputRef}
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

            {dataList.length > 0 && (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Count</th>
                            <th>Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                  
                     <tbody>
                         {dataList.map((data, index) => (
                             <tr key={index}>
                                 <td>{data.number}</td>
                                 <td>{data.count}</td>
                                 <td>{data.type}</td>
                                 <td>
                                     <button className='delete' onClick={() => handleDelete(data.number)}>
                                         <IconTrash stroke={2} />
                                     </button>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                </table>
            )}
        </div>
    );
};

export default Home;
