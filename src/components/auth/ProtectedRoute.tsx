import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const location = useLocation();
  
  // Verificar si el usuario está autenticado
  if (!isAuthenticated) {
    // Redirigir al inicio guardando la ubicación actual
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // Verificar si se requiere rol de admin
  if (requireAdmin && user?.role !== 'Admin') {
    // Redirigir al inicio si no es admin
    return <Navigate to="/" replace />;
  }
  
  // Si está autenticado y tiene los permisos adecuados, mostrar los componentes hijos
  return <>{children}</>;
};

export default ProtectedRoute;