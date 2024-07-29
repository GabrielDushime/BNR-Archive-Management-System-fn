import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  FileOutlined,
 
  LogoutOutlined,
} from '@ant-design/icons';
import Logout from './Logout';
import '../styles/Sidebar.css';


const UserSidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <Menu
        mode="inline"
        theme="light"
        style={{ height: '100%', borderRight: 0 }}
        defaultSelectedKeys={['/user/dashboard']}
       
      >
         <Menu.Item key="/user/dashboard" icon={<DashboardOutlined />} className="menu-item">
          <Link to="/user/dashboard">Dashboard</Link>
        </Menu.Item>
       
  
        <Menu.Item key="/user/userdocuments" icon={<FileOutlined />} className="menu-item">
          <Link to="/user/userdocuments">Documents</Link>
        </Menu.Item>
       
        <Menu.Item key="logout" icon={<LogoutOutlined />} className="menu-item logout-item">
          <Logout />
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default UserSidebar;
