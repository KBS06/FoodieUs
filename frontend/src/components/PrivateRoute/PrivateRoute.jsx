// frontend/src/components/PrivateRoute/PrivateRoute.jsx
import React from "react";
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children, requiredRole = 'user' }) => {
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('user');

  if (!token || !userData) {
    return <Navigate to='/login' replace />;
  }

  try {
    const user = JSON.parse(userData);

    // Check if user has required role
    if (requiredRole && user.role !== requiredRole) {
      // If admin tries to access user routes, redirect to admin panel
      if (user.role === 'admin') {
        window.location.href = 'http://localhost:5174';
        return null;
      }
      // If user tries to access admin routes, redirect to home
      return <Navigate to='/' replace />;
    }

    return children;
  } catch (error) {
    // Invalid user data, redirect to login
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return <Navigate to='/login' replace />;
  }
}

export default PrivateRoute;