import React from 'react';
import { Carousel } from 'antd';
import '../styles/UserDashboard.css';

const UserDashboard: React.FC = () => {
  return (
    <div className="user-dashboard-container">
    
      <div className="carousel-container">
        <Carousel autoplay>
        <div>
          <h3>Welcome to BNR Archive Management System</h3>
          <img src="/images/Home1.png" alt="Welcome" />
        </div>
        <div>
          <h3>Organize Your Documents Efficiently</h3>
          <img src="/images/Home2.png" alt="Organize" />
        </div>
        <div>
          <h3>Secure and Accessible</h3>
          <img src="/images/Home3.png" alt="Secure" />
        </div>
        <div>
          <h3>Welcome to BNR Archive Management System</h3>
          <img src="/images/Home4.png" alt="Welcome" />
        </div>
        <div>
          <h3>Organize Your Documents Efficiently</h3>
          <img src="/images/Home5.png" alt="Organize" />
        </div>
          
        </Carousel>
      </div>
    </div>
  );
};

export default UserDashboard;
