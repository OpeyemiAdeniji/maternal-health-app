import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// guards authenticated-only pages, reads reactive context state instead of a one-off localStorage check so an expiring session redirects immediately
export default function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
