import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = ({ isAuthenticated, redirectPath = '/signin', children }) => {
  // Check if we have a token in localStorage
  const token = localStorage.getItem('token');
  
  // If not authenticated and no token, redirect to login
  if (!isAuthenticated && !token) {
    return <Navigate to={redirectPath} replace />;
  }

  // If we have children, render them, otherwise render null
  return children || null;
};

export default ProtectedRoute;
