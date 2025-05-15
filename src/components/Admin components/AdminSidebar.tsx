/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Button, Drawer } from 'antd';
import {
  DashboardOutlined,
  FileOutlined,
  LogoutOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import Logout from '../Logout';
import '../../styles/AdminStyles/Sidebar.css';

const AdminSidebar: React.FC = () => {
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
          defaultSelectedKeys={['/user/dashboard']}
        >
          <Menu.Item key="/user/dashboard" icon={<DashboardOutlined />} className="menu-item">
            <Link to="/user/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="/user/documents" icon={<FileOutlined />} className="menu-item">
            <Link to="/user/UserDocuments">Documents</Link>
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
          defaultSelectedKeys={['/user/dashboard']}
        >
          <Menu.Item key="/user/dashboard" icon={<DashboardOutlined />} className="menu-item">
            <Link to="/user/dashboard" onClick={onClose}>Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="/user/documents" icon={<FileOutlined />} className="menu-item">
            <Link to="/user/UserDocuments" onClick={onClose}>Documents</Link>
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} className="menu-item logout-item">
            <Logout />
          </Menu.Item>
        </Menu>
      </Drawer>
    </>
  );
};

export default AdminSidebar;