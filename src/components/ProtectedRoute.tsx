import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const location = useLocation();

  // Read auth state from Redux
  const userState = useAppSelector((state) => state.user);
  const userInfo = userState.userInfo;

  // 1. Not authenticated → redirect to login
  if (!userInfo) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // 2. Admin-only route but user is not admin → redirect to home
  if (adminOnly && userInfo.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 3. Authorized → render children
  return <>{children}</>;
}