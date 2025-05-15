import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Button, Drawer } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileOutlined,
  LogoutOutlined,
  ApartmentOutlined,
  TeamOutlined,
  BranchesOutlined,
  AppstoreAddOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import Logout from '../Logout';
import '../../styles/AdminStyles/Sidebar.css';

const SuperAdminSidebar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      {windowWidth <= 768 && (
        <Button
          className="mobile-menu-button"
          icon={<MenuOutlined />}
          onClick={showDrawer}
        />
      )}
      
      <div className="sidebar">
        <Menu
          mode="inline"
          theme="light"
          style={{ borderRight: 0 }}
          defaultSelectedKeys={['/super-admin/dashboard']}
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

      <Drawer
        title="Menu"
        placement="left"
        onClose={onClose}
        open={visible}
        className="sidebar-drawer"
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="inline"
          theme="light"
          style={{ borderRight: 0 }}
          defaultSelectedKeys={['/super-admin/dashboard']}
        >
          <Menu.Item key="/super-admin/dashboard" icon={<DashboardOutlined />} className="menu-item">
            <Link to="/super-admin/dashboard" onClick={onClose}>Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="/users" icon={<UserOutlined />} className="menu-item">
            <Link to="/super-admin/users" onClick={onClose}>Users</Link>
          </Menu.Item>
          <Menu.Item key="/super-admin/directorates" icon={<ApartmentOutlined />} className="menu-item">
            <Link to="/super-admin/directorates" onClick={onClose}>Directorates</Link>
          </Menu.Item>
          <Menu.Item key="/super-admin/departments" icon={<TeamOutlined />} className="menu-item">
            <Link to="/super-admin/departments" onClick={onClose}>Departments</Link>
          </Menu.Item>
          <Menu.Item key="/super-admin/divisions" icon={<BranchesOutlined />} className="menu-item">
            <Link to="/super-admin/divisions" onClick={onClose}>Divisions</Link>
          </Menu.Item>
          <Menu.Item key="/super-admin/types" icon={<AppstoreAddOutlined />} className="menu-item">
            <Link to="/super-admin/types" onClick={onClose}>Types</Link>
          </Menu.Item>
          <Menu.Item key="/super-admin/documents" icon={<FileOutlined />} className="menu-item">
            <Link to="/super-admin/documents" onClick={onClose}>Documents</Link>
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} className="menu-item logout-item">
            <Logout />
          </Menu.Item>
        </Menu>
      </Drawer>
    </>
  );
};

export default SuperAdminSidebar;