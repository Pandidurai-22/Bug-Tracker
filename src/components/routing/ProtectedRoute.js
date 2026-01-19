// src/components/routing/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth.context';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && !roles.some(role => user.roles.includes(role))) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;