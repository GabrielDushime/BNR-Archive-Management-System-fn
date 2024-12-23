// src/layouts/AdminLayout.tsx
import React, { ReactNode } from 'react';
import AdminSidebar from '../components/Admin components/AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default AdminLayout;
