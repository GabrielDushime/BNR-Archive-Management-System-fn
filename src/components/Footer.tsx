import React from 'react';
import { Layout } from 'antd';
import { FacebookOutlined, TwitterOutlined, LinkedinOutlined, YoutubeOutlined, CameraOutlined } from '@ant-design/icons';
import '../styles/Footer.css';

const { Footer } = Layout;

const AppFooter: React.FC = () => {
  return (
    <Footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src="images/logo.jpeg" alt="Logo" />
          <h1>BNR-Archive-Management-System</h1>
        </div>
        <div className="footer-links">
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
        <div className="footer-social">
          <a href="https://www.facebook.com/CentralBankRw/" target="_blank" rel="noopener noreferrer">
            <FacebookOutlined />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <TwitterOutlined />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <LinkedinOutlined />
          </a>
          <a href="https://www.youtube.com/channel/UCNL-AuMdkEhr_FnfeT0BKRQ" target="_blank" rel="noopener noreferrer">
            <YoutubeOutlined />
          </a>
          <a href="https://www.flickr.com/photos/135529030@N06/" target="_blank" rel="noopener noreferrer">
            <CameraOutlined />
          </a>
          
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 BNR-Archive-Management-System. All rights reserved.</p>
      </div>
    </Footer>
  );
};

export default AppFooter;
