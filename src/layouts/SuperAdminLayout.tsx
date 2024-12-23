
import React, { ReactNode } from 'react';
import SuperAdminSidebar from '../components/Super-Admin-Components/SuperAdminSidebar';

interface SuperAdminLayoutProps {
  children: ReactNode;
}

const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children }) => {
  return (
    <div className="admin-layout">
      <SuperAdminSidebar />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default SuperAdminLayout;
