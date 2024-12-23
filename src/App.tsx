import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Signup from './pages/Admin/Signup';
import Login from './pages/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserDashboard from './pages/User/UserDashboard';
import Home from './pages/Home';
import ProtectedRoute from './components/Admin components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import UsersPage from './pages/Admin/UsersPage';
import DocumentsPage from './pages/Admin/DocumentsPage'; 
import UserDocumentsPage from './pages/User/UserDocuments';
import AppFooter from './components/Footer';
import DepartmentsPage from './pages/Admin/DepartmentsPage';
import DirectoratesPage from './pages/Admin/DirectoratesPage';
import DivisionsPage from './pages/Admin/DivisionsPage';
import TypesPage from './pages/Admin/TypesPage';
import DashboardDirectoratesPage from './pages/Admin/DashboardDirectorates';
import DashboardDepartmentsPage from './pages/Admin/DashboardDepartment';
import DashboardDivisionsPage from './pages/Admin/DashboardDivision';
import DashboardTypesPage from './pages/Admin/DashboardType';
import UserDashboardDepartmentsPage from './pages/User/user-dashboarddepartment';
import UserDashboardDivisionsPage from './pages/User/user-divisiondashboard';
import UserDashboardTypesPage from './pages/User/user-dashboardtypes';
import SuperAdminDashboard from './pages/SuperAdmin/SuperAdminDashboard';
import SuperAdminDepartmentsPage from './pages/SuperAdmin/DepartmentsPage';
import SuperAdminDirectoratesPage from './pages/SuperAdmin/DirectoratesPage';
import SuperAdminDivisionsPage from './pages/SuperAdmin/DivisionPage';
import SuperAdminTypesPage from './pages/SuperAdmin/Types';
import SuperAdminUsersPage from './pages/SuperAdmin/UsersPage';
import SuperAdminDocumentsPage from './pages/SuperAdmin/DocumentsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              
              <Route
                path="/admin/dashboard"
                element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}
              />
               <Route
                path="/super-admin/dashboard"
                element={<ProtectedRoute role="super-admin"><SuperAdminDashboard /></ProtectedRoute>}
              />
              <Route
                path="/user/dashboard"
                element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>}
              />
      
              <Route
                path="/admin/users"
                element={<ProtectedRoute role="admin"><UsersPage /></ProtectedRoute>}
              />
              <Route
                path="/super-admin/users"
                element={<ProtectedRoute role="super-admin"><SuperAdminUsersPage /></ProtectedRoute>}
              />
              
              {/* Document Management Route */}
              <Route
                path="/admin/documents"
                element={<ProtectedRoute role="admin"><DocumentsPage /></ProtectedRoute>}
              />
              <Route
                path="/super-admin/documents"
                element={<ProtectedRoute role="super-admin"><SuperAdminDocumentsPage /></ProtectedRoute>}
              />
              <Route
                path="/user/userdocuments"
                element={<ProtectedRoute role="user"><UserDocumentsPage /></ProtectedRoute>}
              />
                <Route
                path="/admin/directorates"
                element={<ProtectedRoute role="admin"><DirectoratesPage /></ProtectedRoute>}
              />
               <Route
                path="/super-admin/directorates"
                element={<ProtectedRoute role="super-admin"><SuperAdminDirectoratesPage /></ProtectedRoute>}
              />
              <Route
                path="/admin/departments"
                element={<ProtectedRoute role="admin"><DepartmentsPage /></ProtectedRoute>}
              />
               <Route
                path="/super-admin/departments"
                element={<ProtectedRoute 
                role="super-admin"><SuperAdminDepartmentsPage /></ProtectedRoute>}
              />
             
  
               <Route
                path="/admin/divisions"
                element={<ProtectedRoute role="admin"><DivisionsPage /></ProtectedRoute>}
              />
              
              
              <Route
                path="/super-admin/divisions"
                element={<ProtectedRoute role="super-admin"><SuperAdminDivisionsPage /></ProtectedRoute>}
              />
               <Route
                path="/admin/types"
                element={<ProtectedRoute role="admin"><TypesPage /></ProtectedRoute>}
              />
               <Route
                path="/super-admin/types"
                element={<ProtectedRoute role="super-admin"><SuperAdminTypesPage /></ProtectedRoute>}
              />
               <Route
                path="/directorates"
                element={<DashboardDirectoratesPage />} 
              />
                <Route
                path="/departments"
                element={<DashboardDepartmentsPage />} 
              />
                <Route
                path="/divisions"
                element={<DashboardDivisionsPage />} 
              />
               <Route
                path="/types"
                element={<DashboardTypesPage />} 
              />
              
              <Route path="/departments/:directorateId" element={<UserDashboardDepartmentsPage />} />
              <Route path="/divisions/:departmentId" element={<UserDashboardDivisionsPage />} />
              <Route path="/types/:divisionId" element={<UserDashboardTypesPage />} />
                
            </Routes>
            
          </main>
          <AppFooter />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
