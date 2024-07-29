// src/layouts/UserLayout.tsx
import React, { ReactNode } from 'react';
import UserDocuments from '../pages/UserDocuments';

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <div className="user-layout">
    
      <UserDocuments/>
    
    </div>
  );
};

export default UserLayout;
