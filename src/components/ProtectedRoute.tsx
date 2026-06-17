import { Navigate } from 'react-router-dom';
import authService from '@/services/authService';
interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!token) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }
  
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (!authService.isAuthenticated()) {
  return <Navigate to="/login" />;
  }
  return <>{children}</>;
}