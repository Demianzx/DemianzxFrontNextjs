import React from 'react';
import AdminSectionHeader from '../../components/admin/AdminSectionHeader';
import AdminDataTable from '../../components/admin/AdminDataTable';

const AdminCategoriesPage: React.FC = () => {
  // Datos de ejemplo (en una implementación real, estos vendrían de una API)
  const categories = [
    { id: '1', name: 'PC Games', postsCount: 45, createdAt: 'January 15, 2024' },
    { id: '2', name: 'Console Games', postsCount: 32, createdAt: 'January 20, 2024' },
    { id: '3', name: 'Mobile Games', postsCount: 28, createdAt: 'February 5, 2024' },
    { id: '4', name: 'VR Games', postsCount: 15, createdAt: 'February 10, 2024' },
    { id: '5', name: 'Indie Games', postsCount: 23, createdAt: 'March 1, 2024' },
    { id: '6', name: 'Game Reviews', postsCount: 37, createdAt: 'March 10, 2024' },
    { id: '7', name: 'Gaming News', postsCount: 52, createdAt: 'March 15, 2024' },
    { id: '8', name: 'Tutorials', postsCount: 19, createdAt: 'April 1, 2024' },
  ];

  // Definimos la interface para nuestro tipo de categoría
  interface Category {
    id: string;
    name: string;
    postsCount: number;
    createdAt: string;
  }

  const columns = [
    { header: 'Category Name', accessor: 'name' },
    { header: 'Posts Count', accessor: 'postsCount' },
    { header: 'Created Date', accessor: 'createdAt' },
    { 
      header: 'Actions', 
      accessor: 'id',
      render: (item: Category) => (
        <div className="flex space-x-2">
          <button className="text-blue-400 hover:text-blue-300">Edit</button>
          <button className="text-red-400 hover:text-red-300">Delete</button>
        </div>
      )
    }
  ];

  const handleNewCategory = () => {
    // En una implementación real, esto abriría un modal para crear una nueva categoría
    console.log('Create new category');
  };

  return (
    <div>
      <AdminSectionHeader 
        title="Categories" 
        buttonText="Add New Category" 
        onButtonClick={handleNewCategory} 
      />
      
      <AdminDataTable
        columns={columns}
        data={categories}
      />
    </div>
  );
};

export default AdminCategoriesPage;