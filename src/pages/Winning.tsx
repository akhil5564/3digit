import React, { FC, useState } from 'react';
import axios from 'axios';
import './winnig.css';

interface WinningProps {}

const Winning: FC<WinningProps> = () => {
  const [numberInput, setNumberInput] = useState<string>(''); // Store user input
  const [errorMessage, setErrorMessage] = useState<string>(''); // Error message for invalid input
  const [loading, setLoading] = useState<boolean>(false); // Loading state to indicate request in progress
  const [data, setData] = useState<any | null>(null); // Store data fetched from API
  const [notFound, setNotFound] = useState<boolean>(false); // Track if the number was found or not

  // Handle the change in the number input
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberInput(e.target.value);
  };

  // Handle the search action when the user clicks the 'Search' button
  const handleSearch = async () => {
    if (numberInput.length !== 3 || isNaN(Number(numberInput))) {
      setErrorMessage('Please enter a valid 3-digit number.');
      return;
    }

    setLoading(true);
    setErrorMessage(''); // Clear any previous error messages
    setNotFound(false); // Reset the not found state
    setData(null); // Clear any previously displayed data

    try {
      // Fetch data from the backend API using the correct URL for searching by number
      const response = await axios.get(`https://threed-backend-uodx.onrender.com/data/${numberInput}`);
      
      // If the data exists, store it
      setData(response.data);
    } catch (error) {
      // If an error occurs or no data is found
      console.error('Error fetching data:', error);
      setErrorMessage('No data found for this number.');
      setNotFound(true); // Show not found message
    } finally {
      setLoading(false); // Turn off loading once the request is completed
    }
  };

  return (
    <div className="winning-container">
      <h1>Search for Number</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Enter 3-digit number"
          value={numberInput}
          onChange={handleNumberInputChange}
          maxLength={3} // Ensure the input is limited to 3 digits
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Show error message if there was an error */}
      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}

      {/* Show data if found */}
      {data && (
        <div className="result-container">
          <h2>Data for Number {data.number}</h2>
          <p><strong>Count:</strong> {data.count}</p>
          <p><strong>Type:</strong> {data.type}</p>
          <p><strong>Created At:</strong> {new Date(data.createdAt).toLocaleString()}</p>
        </div>
      )}

      {/* If no data found for the entered number */}
      {notFound && <p className="error-message" style={{ color: 'red' }}>No data found for this number.</p>}
    </div>
  );
};

export default Winning;
