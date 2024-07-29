import React from 'react';
import '../styles/Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src="images/logo.jpeg" alt="Logo" />
        <h1>BNR-Archive-Management-System</h1>
      </div>
    
    </header>
  );
};

export default Header;
