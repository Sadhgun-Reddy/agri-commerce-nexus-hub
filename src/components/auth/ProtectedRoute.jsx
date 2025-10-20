import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { user, isAuthLoading } = useApp();

  // Show loading state while checking authentication
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-grey-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary-500 mx-auto"></div>
          <p className="mt-4 text-grey-600 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to home and save the attempted location
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;