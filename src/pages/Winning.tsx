import { FC, useState } from 'react';
import axios from 'axios';

const Winning: FC = () => {
  const [numberInput, setNumberInput] = useState<string>(''); // Store user input
  const [foundData, setFoundData] = useState<{ number: number; count: number } | null>(null); // Store matched data
  const [errorMessage, setErrorMessage] = useState<string>(''); // Error message for failed request
  const [loading, setLoading] = useState<boolean>(false); // Loading state to indicate request in progress

  // Handle the change in the number input
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberInput(e.target.value);
  };

  // Handle the search action when the user clicks the 'Search' button
  const handleSearch = async () => {
    if (!numberInput || numberInput.length !== 3) {
      setErrorMessage('Please enter a valid 3-digit number.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setFoundData(null); // Clear previous search result

    try {
      // Make the API request to find the data for the entered number
      const response = await axios.get(`http://localhost:5000/checkNumber/${numberInput}`);

      // If the number is found, store the data
      if (response.data && response.data.number && response.data.count !== undefined) {
        setFoundData({
          number: response.data.number,
          count: response.data.count,
        });
      } else {
        setErrorMessage('Number not found.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="winning-container">
      <h1>Search for Number</h1>
      
      <div className="search-container">
        <input
          type="number"
          placeholder="Enter 3-digit number"
          value={numberInput}
          onChange={handleNumberInputChange}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Show error message if there was an error */}
      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}

      {/* Show the found data if available */}
      {foundData && (
        <div className="result-container">
          <h2>Found Data</h2>
          <p>Number: {foundData.number}</p>
          <p>Count: {foundData.count}</p>
        </div>
      )}
    </div>
  );
};

export default Winning;
