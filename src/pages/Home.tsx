// src/pages/Home.tsx
import React from 'react';
import '../styles/Home.css'; 
import { Link } from 'react-router-dom';
import Carousel from 'antd/es/carousel';


const Home: React.FC = () => {
  return (
    <div>
   
     
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
      <div className="buttons">
       
       <Link to="/login">
         <button>
           Login To Continue
         </button>
       </Link>
     </div>
  </div>

  </div>
  );
};

export default Home;
