import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Categories from './pages/Categories';
import UsersPage from './pages/UsersPage';
import DocumentsPage from './pages/DocumentsPage'; 
import UserDocumentsPage from './pages/UserDocuments';
import AppFooter from './components/Footer';

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
                path="/user/dashboard"
                element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>}
              />
              <Route
                path="/admin/categories"
                element={<ProtectedRoute role="admin"><Categories /></ProtectedRoute>}
              />
              <Route
                path="/admin/users"
                element={<ProtectedRoute role="admin"><UsersPage /></ProtectedRoute>}
              />
              
              {/* Document Management Route */}
              <Route
                path="/admin/documents"
                element={<ProtectedRoute role="admin"><DocumentsPage /></ProtectedRoute>}
              />
              <Route
                path="/user/userdocuments"
                element={<ProtectedRoute role="user"><UserDocumentsPage /></ProtectedRoute>}
              />
            </Routes>
          </main>
          <AppFooter />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
