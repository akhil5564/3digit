import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import './header.css';  // Your CSS file for styling
import { IconClipboardCopy } from '@tabler/icons-react';  // Importing icons from Tabler Icons
import { IconAlignJustified } from '@tabler/icons-react';
import logo from '../assets/th-removebg-preview (1).png'

const Header: FC = () => {
  // State to control the dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();  // Initialize navigate hook
  const [calcResult] = useState<string>("345=5"); // Example result to copy (can be dynamic)

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  // Navigation functions
  const handleReportClick = () => navigate('/reporter');
  const handleSetLimitClick = () => navigate("/set-limit");
  const handleWinningClick = () => navigate("/winning");

  // Function to handle logout
  const handleLogoutClick = () => {
    // Clear the login-related data (if any)
    localStorage.removeItem("isLoggedIn");  // Or sessionStorage.removeItem('isLoggedIn');
    // Navigate back to the login page
    navigate("/");  // Navigate to the login page
  };

  // Function to copy the content to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(calcResult).then(() => {
      alert('Data copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <>

      <div className='calc'>
        <div className='icon'>
          {/* Toggle dropdown */}
          <IconAlignJustified stroke={1} onClick={toggleDropdown} />
        </div>
        <img className='logo' src={logo} alt="Logo" />

        <div className='icon2'>
          {/* Copy to clipboard */}
          <IconClipboardCopy stroke={1} onClick={handleCopy} />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className='dropdown'>
          <ul>
            <li onClick={handleReportClick}>Report</li>
            <li onClick={handleSetLimitClick}>Set Limit</li>
            <li onClick={handleWinningClick}>Winning</li>
            <li>Delete Number</li>
            <li>Profit and Loss</li>
            <li>Result Entry</li>
            <li onClick={handleLogoutClick}>Logout</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Header;
