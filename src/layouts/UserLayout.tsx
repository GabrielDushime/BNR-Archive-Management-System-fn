// src/layouts/UserLayout.tsx
import React, { ReactNode } from 'react';
import UserSidebar from '../components/User components/UserSidebar';

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <div className="user-layout">
       <UserSidebar/>
     
      <main className="main-content">{children}</main>
    </div>
  );
};

export default UserLayout;
