import { Navigate, Outlet } from 'react-router-dom';
import { api } from '../api';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;

    // Check if token is expired (exp is in seconds)
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function PrivateRoute() {
  const token = api.getToken();

  if (!token || isTokenExpired(token)) {
    // Clean up invalid token
    if (token) api.logout();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
