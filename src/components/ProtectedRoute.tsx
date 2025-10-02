import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'agent')[];
}

export const ProtectedRoute = ({ children, allowedRoles = ['admin', 'agent'] }: ProtectedRouteProps) => {
  const { userRole, isLoading } = useAuth();

  // Allow bypass in preview mode
  const isPreview = window.location.hostname.includes('lovable.app') || window.location.hostname.includes('lovableproject.com');
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // In preview, allow access
  if (isPreview) {
    return <>{children}</>;
  }

  // Check if user has required role
  if (!allowedRoles.includes(userRole as any)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
