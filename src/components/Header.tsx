import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import './header.css';  
import { IconClipboardCopy } from '@tabler/icons-react';  
import { IconAlignJustified } from '@tabler/icons-react';
import logo from '../assets/th-removebg-preview (1).png'

interface HeaderProps {
  setPastedData: React.Dispatch<React.SetStateAction<{ number: string, count: string } | null>>;
}

const Header: FC<HeaderProps> = ({ setPastedData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();  
  const [calcResult] = useState<string>("345=5");

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  const handleClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const regex = /^(\d{3})=(\d{1})$/;

      const match = text.match(regex);

      if (match) {
        const number = match[1];
        const count = match[2];

        // Pass the pasted data back to the parent (App)
        setPastedData({ number, count });

        alert(`Data saved: Number = ${number}, Count = ${count}`);
      } else {
        alert('Invalid format. Please use the format: "123=5"');
      }
    } catch (err) {
      console.error('Failed to read clipboard content: ', err);
      alert('Failed to read clipboard content');
    }
  };

  return (
    <>
      <div className='calc'>
        <div className='icon'>
          <IconAlignJustified stroke={1} onClick={toggleDropdown} />
        </div>
        <img className='logo' src={logo} alt="Logo" />

        <div className='icon2'>
          <IconClipboardCopy stroke={1} onClick={handleClipboard} />
        </div>
      </div>

      {isDropdownOpen && (
        <div className='dropdown'>
          <ul>
            <li onClick={() => navigate('/reporter')}>Report</li>
            <li onClick={() => navigate("/set-limit")}>Set Limit</li>
            <li onClick={() => navigate("/winning")}>Winning</li>
            <li onClick={() => ("isLoggedIn") && navigate("/")}>Logout</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Header;
