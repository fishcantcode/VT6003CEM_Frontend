import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const storedUser = localStorage.getItem('user');
  
  if (!storedUser) {
  
    return <Navigate to="/auth" replace />;
  }

  try {
    const user = JSON.parse(storedUser);
    if (user && user.role && allowedRoles.includes(user.role)) {
  
      return <Outlet />;
    } else {
  
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    console.error('Failed to parse user from localStorage', error);
  
    return <Navigate to="/auth" replace />;
  }
};

export default ProtectedRoute;
