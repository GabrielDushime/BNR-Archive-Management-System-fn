import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  FileOutlined,
  PlusOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import Logout from './Logout';
import '../styles/Sidebar.css';

const AdminSidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <Menu
        mode="inline"
        theme="light"
        style={{  borderRight: 0 }}
        defaultSelectedKeys={['/admin/dashboard']}
       
      >
         <Menu.Item key="/admin/dashboard" icon={<DashboardOutlined />} className="menu-item">
          <Link to="/admin/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="/users" icon={<UserOutlined />} className="menu-item">
          <Link to="/admin/users">Users</Link>
        </Menu.Item>
       
        <Menu.Item key="/admin/categories" icon={<AppstoreOutlined />} className="menu-item">
          <Link to="/admin/Categories">Categories</Link>
        </Menu.Item>
        <Menu.Item key="/admin/documents" icon={<FileOutlined />} className="menu-item">
          <Link to="/admin/documents">Documents</Link>
        </Menu.Item>
        <Menu.Item key="/admin/signup" icon={<PlusOutlined />} className="menu-item">
          <Link to="/admin/signup">Create Account</Link>
        </Menu.Item>
        <Menu.Item key="logout" icon={<LogoutOutlined />} className="menu-item logout-item">
          <Logout />
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default AdminSidebar;
