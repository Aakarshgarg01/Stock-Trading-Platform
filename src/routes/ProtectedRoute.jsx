import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { storage } from '../utils/storage';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const token = storage.getToken();
  const location = useLocation();

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
