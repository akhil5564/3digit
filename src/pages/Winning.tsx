import { FC, useState } from 'react';
import axios from 'axios';

const Winning: FC = () => {
  const [numberInput, setNumberInput] = useState<string>(''); // Store user input
  const [foundData, setFoundData] = useState<{ number: number; count: number } | null>(null); // Store matched data
  const [errorMessage, setErrorMessage] = useState<string>(''); // Error message for failed request
  const [loading, setLoading] = useState<boolean>(false); // Loading state to indicate request in progress

  // Handle the input change (restrict to 3 digits)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 3) {
      setNumberInput(value); // Only allow up to 3 digits
    }
  };

  // Handle the search button click
  const handleSearch = async () => {
    if (numberInput.length === 3) {
      setLoading(true);
      setErrorMessage(''); // Clear previous errors
      try {
        const response = await axios.get(`https://threed-backend-1.onrender.com/checkNumber/${numberInput}`);
        
        if (response.data && response.data.number) {
          setFoundData(response.data);
        } else {
          setFoundData(null);
        }
      } catch (error) {
        console.error('Error:', error); // Log the full error to see what is failing
        setErrorMessage('Error fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please enter a 3-digit number.');
    }
  };
  

  return (
    <div>
      <input
        type="number"
        placeholder="Enter 3-digit number"
        value={numberInput}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {/* Show error message if there was an error */}
      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}

      {/* Display the found data or no data message */}
      {foundData ? (
        <div>
          <p>Number: {foundData.number}</p>
          <p>Count: {foundData.count}</p>
        </div>
      ) : (
        numberInput.length === 3 && <p>No data found for this number.</p>
      )}
    </div>
  );
};

export default Winning;
