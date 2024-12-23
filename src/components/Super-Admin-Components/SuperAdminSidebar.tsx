import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileOutlined,
  LogoutOutlined,
  ApartmentOutlined,
  TeamOutlined,
  BranchesOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import Logout from '../Logout';
import '../../styles/AdminStyles/Sidebar.css';

const SuperAdminSidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <Menu
        mode="inline"
        theme="light"
        style={{  borderRight: 0 }}
        defaultSelectedKeys={['/admin/dashboard']}
       
      >
         <Menu.Item key="/super-admin/dashboard" icon={<DashboardOutlined />} className="menu-item">
          <Link to="/super-admin/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="/users" icon={<UserOutlined />} className="menu-item">
          <Link to="/super-admin/users">Users</Link>
        </Menu.Item>
       
        <Menu.Item key="/super-admin/directorates" icon={<ApartmentOutlined />} className="menu-item">
          <Link to="/super-admin/directorates">Directorates</Link>
        </Menu.Item>
        <Menu.Item key="/super-admin/departments" icon={<TeamOutlined />} className="menu-item">
          <Link to="/super-admin/departments">Departments</Link>
        </Menu.Item>
        <Menu.Item key="/super-admin/divisions" icon={<BranchesOutlined />} className="menu-item">
          <Link to="/super-admin/divisions">Divisions</Link>
        </Menu.Item>
        <Menu.Item key="/super-admin/types" icon={<AppstoreAddOutlined />} className="menu-item">
          <Link to="/super-admin/types">Types</Link>
        </Menu.Item>
        <Menu.Item key="/super-admin/documents" icon={<FileOutlined />} className="menu-item">
          <Link to="/super-admin/documents">Documents</Link>
        </Menu.Item>
        <Menu.Item key="logout" icon={<LogoutOutlined />} className="menu-item logout-item">
          <Logout />
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default SuperAdminSidebar;
