import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './Header.css';
import logo from '../assets/v-removebg.png'; 

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo-container">
        <img src={logo} alt="VmeetSummaries Logo" className="logo-img" />
      </div>
      <div className="user-icon">
        <FaUserCircle size={30} color="#555" />
      </div>
    </header>
  );
};

export default Header;
