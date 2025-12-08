import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { Role } from '../types/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  redirectTo?: string;
}

/**
 * RoleGuard Component
 * Protects routes based on user roles
 * Usage: <RoleGuard allowedRoles={['ADMIN', 'MODERATOR']}><AdminPage /></RoleGuard>
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  redirectTo = '/dashboard',
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
