import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  if (requireAuth && !isAuthenticated) {
    // Redirect to login if trying to access protected route while not authenticated
    return <Navigate to="/auth/login" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // Redirect to dashboard if trying to access public route while authenticated
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}; 