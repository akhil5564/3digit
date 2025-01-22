import React, { FC, useEffect, useRef, useState } from 'react';
import './home.css';
import { IconTrash } from '@tabler/icons-react';
import { reportData, getNumberCountFromDb } from '../services/allApi';

interface DataType {
    createdAt: string | number | Date;
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
    const [pastedData, setPastedData] = useState<DataType | null>(null); // Added state for pasted data

    const secondInputRef = useRef<HTMLInputElement>(null);
    const firstInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Retrieve data from localStorage when the component mounts
        const storedDataList = localStorage.getItem('dataList');
        if (storedDataList) {
            setDataList(JSON.parse(storedDataList));
        }

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

        // Disable scrolling on the Home page (body overflow hidden)
        document.body.style.overflow = 'hidden';

        // Prevent scroll refresh behavior
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault(); // Prevent page refresh or unexpected behavior when scrolling
        };

        // Attach event listener for wheel (scrolling)
        window.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            // Cleanup event listener on component unmount
            window.removeEventListener('wheel', handleWheel);
            document.body.style.overflow = 'auto'; // Re-enable scrolling when component unmounts
        };
    }, []);

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

    // Calculate total count
    const totalCount = dataList.reduce((sum, data) => sum + Number(data.count), 0);

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
                <div className="data-table-container">
                    
            {/* Display Total Count */}
            <div className="count">
                <p>Total Count: {totalCount}</p>
            </div>

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
  {/* Display pasted data first, if exists */}
  {pastedData && (
    <tr key={pastedData.number}>
      <td>{pastedData.number}</td>
      <td>{pastedData.count}</td>
      <td>{pastedData.type}</td>
      <td>
        <button
          className="delete"
          onClick={() => handleDelete(pastedData.number)}
          aria-label={`Delete pasted item with number ${pastedData.number}`} // Accessibility improvement
        >
          <IconTrash stroke={2} />
        </button>
      </td>
    </tr>
  )}

  {/* Sort the data based on 'createdAt' so the latest added items come first */}
  {[...(pastedData ? [pastedData] : []), ...dataList]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) // Sort by createdAt (ascending)
    .map((data) => (
      <tr key={data.number}>  {/* Using number as a unique key */}
        <td>{data.number}</td>
        <td>{data.count}</td>
        <td>{data.type}</td>
        <td>
          <button
            className="delete"
            onClick={() => handleDelete(data.number)}
            aria-label={`Delete item with number ${data.number}`} // Accessibility improvement
          >
            <IconTrash stroke={2} />
          </button>
        </td>
      </tr>
    ))}
</tbody>

                    </table>
                </div>
            )}
        </div>
    );
};

export default Home;
