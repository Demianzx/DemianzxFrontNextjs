"use client";

import React, { useEffect, useState } from 'react';
import AdminSectionHeader from '../../components/admin/AdminSectionHeader';
import AdminDataTable, { Column } from '../../components/admin/AdminDataTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCategories, createCategory, deleteCategory } from '../../store/slices/categoriesSlice';
import { fetchTags, createTag, deleteTag } from '../../store/slices/tagsSlice';
import Button from '../../components/common/Button';
import { addNotification } from '../../store/slices/uiSlice';

// Definimos interfaces para nuestros elementos de tabla
interface CategoryTableItem extends Record<string, unknown> {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface TagTableItem extends Record<string, unknown> {
  id: number;
  name: string;
  slug: string;
}

const AdminCategoriesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'categories' | 'tags'>('categories');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  
  // Obtener las categorías y tags del store
  const { 
    items: categoriesFromStore, 
    isLoading: isLoadingCategories, 
    error: categoriesError 
  } = useAppSelector(state => state.categories);

  const { 
    items: tagsFromStore, 
    isLoading: isLoadingTags, 
    error: tagsError 
  } = useAppSelector(state => state.tags);

  // Cargar las categorías y tags al montar el componente
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTags());
  }, [dispatch]);

  // Convertir las categorías al formato que espera la tabla
  const categories: CategoryTableItem[] = categoriesFromStore.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || 'Sin descripción'
  }));

  // Convertir los tags al formato que espera la tabla
  const tags: TagTableItem[] = tagsFromStore.map(tag => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug
  }));

  // Definimos las columnas para la tabla de categorías
  const categoryColumns: Column<CategoryTableItem>[] = [
    { header: 'Nombre', accessor: 'name' },
    { header: 'Slug', accessor: 'slug' },
    { 
      header: 'Descripción', 
      accessor: 'description',
      render: (item: CategoryTableItem) => (
        <div className="max-w-xs truncate">
          {item.description || 'Sin descripción'}
        </div>
      )
    },
    { 
      header: 'Acciones', 
      accessor: 'id',
      render: (item: CategoryTableItem) => (
        <div className="flex space-x-2">
          <button 
            className="text-blue-400 hover:text-blue-300"
            onClick={(e) => {
              e.stopPropagation();
              handleEditItem('category', item.id, item.name, item.description as string);
            }}
          >
            Editar
          </button>
          <button 
            className="text-red-400 hover:text-red-300"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteItem('category', item.id, item.name);
            }}
          >
            Borrar
          </button>
        </div>
      )
    }
  ];

  // Definimos las columnas para la tabla de tags
  const tagColumns: Column<TagTableItem>[] = [
    { header: 'Nombre', accessor: 'name' },
    { header: 'Slug', accessor: 'slug' },
    { 
      header: 'Acciones', 
      accessor: 'id',
      render: (item: TagTableItem) => (
        <div className="flex space-x-2">
          <button 
            className="text-red-400 hover:text-red-300"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteItem('tag', item.id, item.name);
            }}
          >
            Borrar
          </button>
        </div>
      )
    }
  ];

  const handleCreateItem = () => {
    if (!newItemName.trim()) {
      dispatch(addNotification({
        type: 'error',
        message: `Por favor ingresa un nombre para ${activeTab === 'categories' ? 'la categoría' : 'la etiqueta'}`
      }));
      return;
    }

    if (activeTab === 'categories') {
      dispatch(createCategory({
        name: newItemName,
        description: newItemDescription
      })).then(() => {
        dispatch(addNotification({
          type: 'success',
          message: `Categoría "${newItemName}" creada con éxito`
        }));
        closeModal();
      }).catch((error) => {
        dispatch(addNotification({
          type: 'error',
          message: `Error al crear la categoría: ${error.message}`
        }));
      });
    } else {
      dispatch(createTag(newItemName)).then(() => {
        dispatch(addNotification({
          type: 'success',
          message: `Etiqueta "${newItemName}" creada con éxito`
        }));
        closeModal();
      }).catch((error) => {
        dispatch(addNotification({
          type: 'error',
          message: `Error al crear la etiqueta: ${error.message}`
        }));
      });
    }
  };

  const handleEditItem = (type: 'category' | 'tag', id: number, name: string, description?: string) => {
    // En una implementación real, esto abriría un modal para editar
    setNewItemName(name);
    setNewItemDescription(description || '');
    setShowCreateModal(true);
  };

  const handleDeleteItem = (type: 'category' | 'tag', id: number, name: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar ${type === 'category' ? 'la categoría' : 'la etiqueta'} "${name}"?`)) {
      if (type === 'category') {
        dispatch(deleteCategory(id)).then(() => {
          dispatch(addNotification({
            type: 'success',
            message: `Categoría "${name}" eliminada con éxito`
          }));
        }).catch((error) => {
          dispatch(addNotification({
            type: 'error',
            message: `Error al eliminar la categoría: ${error.message}`
          }));
        });
      } else {
        dispatch(deleteTag(id)).then(() => {
          dispatch(addNotification({
            type: 'success',
            message: `Etiqueta "${name}" eliminada con éxito`
          }));
        }).catch((error) => {
          dispatch(addNotification({
            type: 'error',
            message: `Error al eliminar la etiqueta: ${error.message}`
          }));
        });
      }
    }
  };

  const openModal = () => {
    setNewItemName('');
    setNewItemDescription('');
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setNewItemName('');
    setNewItemDescription('');
  };

  // Determinar el título y botón según la pestaña activa
  const getHeaderTitle = () => activeTab === 'categories' ? 'Categorías' : 'Etiquetas';
  const getButtonText = () => `Añadir ${activeTab === 'categories' ? 'Categoría' : 'Etiqueta'}`;

  if (isLoadingCategories && activeTab === 'categories' || isLoadingTags && activeTab === 'tags') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const error = activeTab === 'categories' ? categoriesError : tagsError;
  if (error) {
    return (
      <div className="bg-red-900 text-white p-4 rounded-md">
        Error al cargar {activeTab === 'categories' ? 'categorías' : 'etiquetas'}: {error}
      </div>
    );
  }

  return (
    <div>
      {/* Header con tabs */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Taxonomías</h1>
          <div className="flex space-x-1 mt-4 border-b border-gray-700">
            <button
              className={`py-2 px-4 font-medium transition-colors ${
                activeTab === 'categories' 
                  ? 'text-white border-b-2 border-purple-600' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('categories')}
            >
              Categorías
            </button>
            <button
              className={`py-2 px-4 font-medium transition-colors ${
                activeTab === 'tags' 
                  ? 'text-white border-b-2 border-purple-600' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('tags')}
            >
              Etiquetas
            </button>
          </div>
        </div>
        <Button onClick={openModal}>{getButtonText()}</Button>
      </div>
      
      {/* Tabla de datos */}
      {activeTab === 'categories' ? (
        <AdminDataTable<CategoryTableItem>
          columns={categoryColumns}
          data={categories}
        />
      ) : (
        <AdminDataTable<TagTableItem>
          columns={tagColumns}
          data={tags}
        />
      )}

      {/* Modal de creación */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {newItemName ? 'Editar' : 'Crear'} {activeTab === 'categories' ? 'Categoría' : 'Etiqueta'}
            </h2>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Nombre</label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                placeholder={`Nombre de ${activeTab === 'categories' ? 'la categoría' : 'la etiqueta'}`}
              />
            </div>
            
            {activeTab === 'categories' && (
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Descripción</label>
                <textarea
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white h-24"
                  placeholder="Descripción de la categoría (opcional)"
                ></textarea>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateItem}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
              >
                {newItemName ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;