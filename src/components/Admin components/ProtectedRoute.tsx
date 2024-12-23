// src/components/ProtectedRoute.tsx
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../layouts/AdminLayout';
import UserLayout from '../../layouts/UserLayout';
import SuperAdminLayout from '../../layouts/SuperAdminLayout';

interface ProtectedRouteProps {
  children: ReactNode;
  role: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== role) {
    return null; 
  }


  if (role === 'admin') {
    return <AdminLayout>{children}</AdminLayout>;
  }

  if (role === 'user') {
    return <UserLayout>{children}</UserLayout>;
  }
  if (role === 'super-admin') {
    return <SuperAdminLayout>{children}</SuperAdminLayout>;
  }

  return null; 
};

export default ProtectedRoute;
