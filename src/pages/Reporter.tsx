import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { IconTrash } from '@tabler/icons-react';
import './Report.css';  // Assuming you will create this CSS file for styling

interface ReportData {
  _id: string;
  count: number;
  number: number;
  createdAt: string;  // This is expected to be a timestamp string
  updatedAt: string;
  __v: number;
}

const Report: FC = () => {
  const [data, setData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data');
        console.log('API Response:', response.data);

        if (Array.isArray(response.data)) {
          setData(response.data);
        } else {
          setError('The received data format is invalid. Expected an array.');
        }
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to clear all data both from the frontend and backend
  const clearData = async () => {
    try {
      // Make a DELETE request to the backend to clear the data
      const response = await axios.delete('http://localhost:5000/api/clearData');
      console.log(response.data); // Log the response from backend (success message)

      // If the backend clears data successfully, clear it from the frontend
      setData([]);
    } catch (err: any) {
      console.error('Error clearing data:', err);
      setError('Failed to clear data. Please try again later.');
    }
  };

  // Function to delete a specific item
  const deleteItem = async (id: string) => {
    try {
      // Make a DELETE request to the backend to delete the specific item by its id
      const response = await axios.delete(`http://localhost:5000/api/data/${id}`);
      console.log('Item deleted:', response.data);

      // If the backend successfully deletes the item, remove it from the frontend state
      setData((prevData) => prevData.filter(item => item._id !== id));
    } catch (err: any) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item. Please try again later.');
    }
  };

  // Function to format the createdAt timestamp to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // You can customize the date format as needed
  };

  // If loading, show a loading message
  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  // If there's an error, show the error message
  if (error) {
    return <p className="error-message">{error}</p>;
  }

  // If no data is available, show a no data message
  if (data.length === 0) {
    return <p className="no-data">No data available</p>;
  }

  return (
    <div className="report-container">
      <h1>Report</h1>
      <button className="clear-button" onClick={clearData}>Clear All</button>
      <table className="report-table">
        <thead>
          <tr>
            <th>Number</th>
            <th>Count</th>
            <th>Created At</th> {/* Added new column for Created At */}
            <th>Action</th> {/* Added column for the Delete button */}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.number}</td>
              <td>{item.count}</td>
              <td>{formatDate(item.createdAt)}</td> {/* Format the createdAt field */}
              <td>
                <button
                  className="delete-button"
                  onClick={() => deleteItem(item._id)} // Call delete function on button click
                >
               <IconTrash stroke={2} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Report;
