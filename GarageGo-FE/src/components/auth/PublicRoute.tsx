import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  if (isAuthenticated && user) {
    // Redirect based on user role
    if (user.role === 'Admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/customer/home" replace />;
    }
  }

  return <>{children}</>;
};
