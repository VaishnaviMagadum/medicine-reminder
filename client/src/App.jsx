import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar.jsx';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || 'user');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleAuthUpdate = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') || 'user';
    console.log('Manual Auth Update:', { token: !!token, role });
    setIsAuthenticated(!!token);
    setUserRole(role);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role') || 'user';
      console.log('Storage Change Event:', { token: !!token, role });
      setIsAuthenticated(!!token);
      setUserRole(role);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} handleAuthUpdate={handleAuthUpdate} /> : <Navigate to={userRole === 'admin' ? "/admin" : "/"} />} 
        />
        
        <Route 
          path="/" 
          element={isAuthenticated ? (userRole === 'admin' ? <Navigate to="/admin" /> : <Dashboard theme={theme} setTheme={setTheme} />) : <Navigate to="/login" />} 
        />

        <Route 
          path="/calendar" 
          element={isAuthenticated ? <Calendar /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/admin" 
          element={isAuthenticated && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
