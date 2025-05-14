import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../store/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const router = useRouter();
  
  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      // Redirigir al inicio
      router.push('/');
      return;
    }
    
    // Verificar si se requiere rol de admin
    if (requireAdmin && user?.role !== 'Admin') {
      // Redirigir al inicio si no es admin
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, requireAdmin, router]);
  
  // Si no está autenticado o no tiene permisos, no renderizar los hijos
  if (!isAuthenticated || (requireAdmin && user?.role !== 'Admin')) {
    return null;
  }
  
  // Si está autenticado y tiene los permisos adecuados, mostrar los componentes hijos
  return <>{children}</>;
};

export default ProtectedRoute;