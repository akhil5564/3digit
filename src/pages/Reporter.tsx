import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { IconTrash } from '@tabler/icons-react';
import './report.css';  // Assuming you will create this CSS file for styling

interface ReportData {
  _id: string;
  count: number;
  number: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Report: FC = () => {
  const [data, setData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    // Disable scrolling on body when the Report page is active
    document.body.style.overflow = 'hidden';

    const fetchData = async () => {
      try {
        const response = await axios.get('https://threed-backend-uodx.onrender.com/data');
        console.log('API Response:', response.data);

        if (Array.isArray(response.data)) {
          setData(response.data);
        } else {
          setError('The received data format is invalid. Expected an array.');
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup: Re-enable scrolling when the component is unmounted
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Function to clear all data both from the frontend and backend
  const clearData = async () => {
    try {
      const response = await axios.delete('https://threed-backend-uodx.onrender.com/clearData');
      console.log(response.data); // Log the response from backend (success message)

      setData([]); // Clear frontend data
    } catch (err: any) {
      console.error('Error clearing data:', err);
      setError('Failed to clear data. Please try again later.');
    }
  };

  // Function to delete a specific item
  const deleteItem = async (id: string) => {
    try {
      console.log(`Deleting item with id: ${id}`); // Log the id being passed
      const response = await axios.delete(`https://threed-backend-uodx.onrender.com/data/${id}`);
      console.log('Item deleted:', response.data);

      setData((prevData) => prevData.filter((item) => item._id !== id)); // Update state
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

  // Calculate the sum of all counts in the data
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);
  const totalsales = totalCount * 10

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
      <div className="fix">
        <button className="clear-button" onClick={clearData}>
          Clear All
        </button>
      </div>
      
      
      <table className="report-table">
        <thead>
          <tr>
            <th>Number</th>
            <th>Count</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className='tbd'>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{String(item.number).padStart(3, '0')}</td> {/* Ensure 3 digits for number */}
              <td>{item.count}</td>
              <td>{formatDate(item.createdAt)}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => deleteItem(item._id)}
                  aria-label={`Delete item ${item.number}`} // Accessibility
                >
                  <IconTrash stroke={2} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

       
      {/* Display Total Count */}
      <div className="total-count">
        <p>Total Count: {totalCount}</p>
        <p>Total Sale:  {totalsales}</p>
      </div>
    </div>
     
  );
};


export default Report;
