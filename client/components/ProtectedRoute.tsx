import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo,
}) => {
  const { isAuthenticated, isAdmin: userIsAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo || "/login"} state={{ from: location }} replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && !userIsAdmin) {
    return <Navigate to={redirectTo || "/"} replace />;
  }

  // If user is authenticated but trying to access login page, redirect to appropriate page
  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to={userIsAdmin ? "/admin" : "/profile"} replace />;
  }

  // If user is admin but trying to access admin login page, redirect to admin dashboard
  if (userIsAdmin && location.pathname === "/admin/login") {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
