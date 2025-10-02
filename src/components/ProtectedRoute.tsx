import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'agent')[];
}

export const ProtectedRoute = ({ children, allowedRoles = ['admin', 'agent'] }: ProtectedRouteProps) => {
  // 1) Check preview FIRST - no auth needed
  const host = window.location.hostname;
  const isPreview = host.includes('lovable.app') || host.includes('lovableproject.com');
  
  if (isPreview) {
    return <>{children}</>;
  }

  // 2) Now check auth state for production
  const { userRole, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 3) Redirect to /login (not /) if unauthorized
  if (!allowedRoles.includes(userRole as any)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
