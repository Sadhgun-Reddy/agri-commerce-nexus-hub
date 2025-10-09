import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext.jsx';
import { useToast } from '@/hooks/use-toast.js';

const AdminRoute = ({ children }) => {
  const { user, isAuthLoading } = useApp();
  const location = useLocation();
  const { toast } = useToast();

  // Show loading state while checking authentication
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to home if not authenticated
  if (!user) {
    toast({
      title: 'Authentication Required',
      description: 'Please login to access this page.',
      variant: 'destructive',
    });
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check if user has admin role
  if (user.role !== 'admin') {
    toast({
      title: 'Access Denied',
      description: 'You do not have permission to access this page.',
      variant: 'destructive',
    });
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
