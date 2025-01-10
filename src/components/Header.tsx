import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import './header.css';
import { IconClipboardCopy } from '@tabler/icons-react';
import { IconAlignJustified } from '@tabler/icons-react';

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  // State to control the dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();  // Initialize navigate hook
  const [calcResult, setCalcResult] = useState("345=5"); // Example result to copy (can be dynamic)

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  // Function to handle navigation when "Report" is clicked
  const handleReportClick = () => {
    navigate("/report");  // Navigate to the /report page
  };

  // Function to handle navigation when "Set Limit" is clicked
  const handleSetLimitClick = () => {
    navigate("/set-limit");  // Navigate to the /set-limit page
  };

  // Function to handle navigation when "Winning" is clicked
  const handleWinningClick = () => {
    navigate("/winning");  // Navigate to the /winning page
  };

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
          <IconAlignJustified stroke={4} onClick={toggleDropdown} />
        </div>
        <h1>Calculator</h1>
        <div className='icon2'>
          <IconClipboardCopy stroke={3} onClick={handleCopy} />
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
            <li onClick={handleLogoutClick}>Logout</li> {/* Add Logout option */}
          </ul>
        </div>
      )}
    </>
  );
};

export default Header;
