import { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';  // Import useNavigate and useLocation
import './header.css';
import { IconClipboardCopy } from '@tabler/icons-react';
import { IconAlignJustified } from '@tabler/icons-react';

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  // State to control the dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();  // Initialize navigate hook
  const location = useLocation();  // To get current route for active link styling

  const [calcResult, setCalcResult] = useState("345=5"); // Example result to copy (can be dynamic)

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  // Function to handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsDropdownOpen(false);  // Close dropdown after navigation
  };

  // Function to handle logout
  const handleLogoutClick = () => {
    // Clear login-related data
    localStorage.removeItem("isLoggedIn");  // Or sessionStorage.removeItem('isLoggedIn');
    navigate("/");  // Navigate to login page
  };

  // Function to copy the content to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(calcResult).then(() => {
      alert('Data copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  // Highlight active link based on current location
  const getActiveClass = (path: string) => {
    return location.pathname === path ? 'active' : '';
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
            <li className={getActiveClass("/home")} onClick={() => handleNavigation("/home")}>Home</li>
            <li className={getActiveClass("/report")} onClick={() => handleNavigation("/report")}>Report</li>
            <li className={getActiveClass("/set-limit")} onClick={() => handleNavigation("/set-limit")}>Set Limit</li>
            <li className={getActiveClass("/winning")} onClick={() => handleNavigation("/winning")}>Winning</li>
            <li className={getActiveClass("/delete-number")} onClick={() => handleNavigation("/delete-number")}>Delete Number</li>
            <li className={getActiveClass("/profit-loss")} onClick={() => handleNavigation("/profit-loss")}>Profit and Loss</li>
            <li className={getActiveClass("/result-entry")} onClick={() => handleNavigation("/result-entry")}>Result Entry</li>
            <li onClick={handleLogoutClick}>Logout</li> {/* Add Logout option */}
          </ul>
        </div>
      )}
    </>
  );
};

export default Header;
