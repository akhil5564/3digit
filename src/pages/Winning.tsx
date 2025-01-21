import React, { FC, useState, useEffect } from 'react';
import axios from 'axios';
import './winnig.css'

interface WinningProps {}

const Winning: FC<WinningProps> = () => {
  const [numberInput, setNumberInput] = useState<string>(''); // Store user input
  const [errorMessage, setErrorMessage] = useState<string>(''); // Error message for invalid input
  const [loading, setLoading] = useState<boolean>(false); // Loading state to indicate request in progress
  const [successMessage, setSuccessMessage] = useState<string>(''); // Success message after saving data
  const [totalCount, setTotalCount] = useState<number>(0); // State to store the sum of all counts

  // Fetch total count from the backend when the component mounts
  const fetchTotalCount = async () => {
    try {
      const response = await axios.get('https://your-backend-api-url.com/total-count');
      if (response.data && response.data.totalCount !== undefined) {
        setTotalCount(response.data.totalCount); // Update the total count
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error fetching total count. Please try again later.');
    }
  };

  // Call fetchTotalCount when the component mounts
  useEffect(() => {
    fetchTotalCount();
  }, []);

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

    try {
      // Call the backend to map the number in the database
      const dataToSave = {
        number: numberInput,
        count: 1, // You can adjust this logic as needed
      };

      // Send the data to the backend (for example using POST to save it)
      const response = await axios.post('https://your-backend-api-url.com/data', dataToSave);

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage('Data successfully saved/updated!');
        fetchTotalCount(); // After saving, fetch the updated total count
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error saving data. Please try again later.');
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

      {/* Show success message if data was saved/updated */}
      {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}

      {/* Display total count at the bottom */}
      <div className="total-count-container">
        <h3>Total Count of All Numbers: {totalCount}</h3>
      </div>
    </div>
  );
};

export default Winning;
