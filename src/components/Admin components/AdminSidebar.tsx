import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileOutlined,
  PlusOutlined,
  LogoutOutlined,
  ApartmentOutlined,
  TeamOutlined,
  BranchesOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import Logout from '../Logout';
import '../../styles/AdminStyles/Sidebar.css';

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
       
        <Menu.Item key="/admin/directorates" icon={<ApartmentOutlined />} className="menu-item">
          <Link to="/admin/directorates">Directorates</Link>
        </Menu.Item>
        <Menu.Item key="/admin/departments" icon={<TeamOutlined />} className="menu-item">
          <Link to="/admin/departments">Departments</Link>
        </Menu.Item>
        <Menu.Item key="/admin/divisions" icon={<BranchesOutlined />} className="menu-item">
          <Link to="/admin/divisions">Divisions</Link>
        </Menu.Item>
        <Menu.Item key="/admin/types" icon={<AppstoreAddOutlined />} className="menu-item">
          <Link to="/admin/types">Types</Link>
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
