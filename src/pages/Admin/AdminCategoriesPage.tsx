"use client";

import React, { useEffect } from 'react';
import AdminSectionHeader from '../../components/admin/AdminSectionHeader';
import AdminDataTable, { Column } from '../../components/admin/AdminDataTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCategories } from '../../store/slices/categoriesSlice';

// Definimos la interface para nuestro tipo de categoría adaptada para la tabla
interface CategoryTableItem extends Record<string, unknown> {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

const AdminCategoriesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Obtener las categorías del store
  const { items: categoriesFromStore, isLoading, error } = useAppSelector(state => state.categories);

  // Cargar las categorías al montar el componente
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Convertir las categorías al formato que espera la tabla
  const categories: CategoryTableItem[] = categoriesFromStore.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || 'No description'
  }));

  // Definimos las columnas con el tipo adecuado
  const columns: Column<CategoryTableItem>[] = [
    { header: 'Category Name', accessor: 'name' },
    { header: 'Slug', accessor: 'slug' },
    { 
      header: 'Description', 
      accessor: 'description',
      render: (item: CategoryTableItem) => (
        <div className="max-w-xs truncate">
          {item.description || 'No description'}
        </div>
      )
    },
    { 
      header: 'Actions', 
      accessor: 'id',
      render: (item: CategoryTableItem) => (
        <div className="flex space-x-2">
          <button 
            className="text-blue-400 hover:text-blue-300"
            onClick={(e) => {
              e.stopPropagation();
              handleEditCategory(item.id);
            }}
          >
            Editar
          </button>
          <button 
            className="text-red-400 hover:text-red-300"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCategory(item.id);
            }}
          >
            Borrar
          </button>
        </div>
      )
    }
  ];

  const handleNewCategory = () => {
    // En una implementación real, esto abriría un modal para crear una nueva categoría
    console.log('Create new category');
  };

  const handleEditCategory = (id: number) => {
    // En una implementación real, esto abriría un modal para editar la categoría
    console.log('Edit category:', id);
  };

  const handleDeleteCategory = (id: number) => {
    // En una implementación real, esto mostraría un diálogo de confirmación
    console.log('Delete category:', id);
    alert(`Category with ID ${id} would be deleted`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 text-white p-4 rounded-md">
        Error al cargar categorias: {error}
      </div>
    );
  }

  return (
    <div>
      <AdminSectionHeader 
        title="Categories" 
        buttonText="Add New Category" 
        onButtonClick={handleNewCategory} 
      />
      
      <AdminDataTable<CategoryTableItem>
        columns={columns}
        data={categories}
      />
    </div>
  );
};

export default AdminCategoriesPage;