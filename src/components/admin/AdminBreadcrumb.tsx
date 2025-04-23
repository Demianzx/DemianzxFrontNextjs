import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminBreadcrumb: React.FC = () => {
  const location = useLocation();
  
  // Función para generar las rutas de migas de pan
  const getBreadcrumbs = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    let currentPath = '';
    
    // Siempre incluimos Admin como primer elemento
    const breadcrumbs = [
      { label: 'Admin', path: '/admin' }
    ];
    
    // Añadimos los elementos adicionales basados en la ruta actual
    for (let i = 1; i < pathParts.length; i++) {
      const part = pathParts[i];
      currentPath += `/${part}`;
      
      // Si es un ID (para edición), usamos un formato especial
      if (i === 3 && pathParts[i-1] === 'edit') {
        breadcrumbs.push({ 
          label: 'Edit', 
          path: currentPath 
        });
      } 
      // Si es 'create', usamos el formato para crear
      else if (part === 'create') {
        breadcrumbs.push({ 
          label: 'Create Post', 
          path: currentPath 
        });
      }
      // Para las rutas normales, formateamos el texto
      else if (!['edit', 'posts', 'categories', 'users', 'settings'].includes(pathParts[i-1])) {
        const formattedLabel = part.charAt(0).toUpperCase() + part.slice(1);
        breadcrumbs.push({ 
          label: formattedLabel, 
          path: `/admin/${part}` 
        });
      }
    }
    
    return breadcrumbs;
  };
  
  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="mx-2">/</span>
          )}
          
          {index === breadcrumbs.length - 1 ? (
            <span className="text-white">{crumb.label}</span>
          ) : (
            <Link 
              to={crumb.path}
              className="hover:text-purple-400 transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default AdminBreadcrumb;