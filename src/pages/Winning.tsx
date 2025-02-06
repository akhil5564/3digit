import React, { FC, useState } from 'react';
import axios from 'axios';
import './winnig.css';

interface WinningProps {}

const Winning: FC<WinningProps> = () => {
  const [numberInput, setNumberInput] = useState<string>(''); // Store user input
  const [errorMessage, setErrorMessage] = useState<string>(''); // Error message for invalid input
  const [loading, setLoading] = useState<boolean>(false); // Loading state to indicate request in progress
  const [successMessage, setSuccessMessage] = useState<string>(''); // Success message after saving data
  const [fullArray, setFullArray] = useState<any[]>([]); // State to store the full array

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
    setErrorMessage('');
    setSuccessMessage('');
    setFullArray([]); // Clear previous results

    try {
      // First, check if the number already exists in the database
      const response = await axios.get(`http://localhost:5000/data/${numberInput}`);

      if (response.status === 200) {
        // If the number exists, display the full array
        setFullArray(response.data);
        setSuccessMessage('Number found in the database!');
      } else {
        setErrorMessage('Number not found.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error retrieving data. Please try again later.');
    } finally {
      setLoading(false);
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

      {/* Show success message if data was found */}
      {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}

      {/* Show the full array if the number was found */}
      {fullArray.length > 0 && (
        <div className="full-array">
          <h2>Full Data Array:</h2>
          <pre>{JSON.stringify(fullArray, null, 2)}</pre> {/* Display full array in a readable format */}
        </div>
      )}
    </div>
  );
};

export default Winning;
