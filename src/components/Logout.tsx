// src/components/Logout.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    // Redirect to home page
    navigate('/');
  };

  return (
    <Button type="primary" onClick={handleLogout} className="logout-button">
      Logout
    </Button>
  );
};

export default Logout;
