"use client";

import React, { useState } from 'react';
import AdminSectionHeader from '../../components/admin/AdminSectionHeader';
import MediaGallery from '../../components/media/MediaGallery';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { deleteMediaFile } from '../../store/slices/mediaSlice';
import { addNotification } from '../../store/slices/uiSlice';

const AdminMediaPage: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const { isLoading, error } = useAppSelector(state => state.media);
  const dispatch = useAppDispatch();

  // Función para manejar la eliminación masiva de archivos
  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return;

    if (confirm(`Are you sure you want to delete ${selectedFiles.length} files?`)) {
      try {
        // Crear un array de promesas para eliminar todos los archivos seleccionados
        const deletePromises = selectedFiles.map(fileName => 
          dispatch(deleteMediaFile(fileName)).unwrap()
        );
        
        // Esperar a que todas las eliminaciones se completen
        await Promise.all(deletePromises);
        
        // Notificar al usuario del éxito
        dispatch(addNotification({
          type: 'success',
          message: `Successfully deleted ${selectedFiles.length} files`
        }));
        
        // Limpiar la selección
        setSelectedFiles([]);
      } catch (error) {
        console.error('Error deleting files:', error);
        
        // Notificar al usuario del error
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to delete one or more files'
        }));
      }
    }
  };

  return (
    <div>
      <AdminSectionHeader 
        title="Media Library" 
        buttonText="Upload New"
        onButtonClick={() => document.getElementById('media-upload-button')?.click()}
      />
      
      {error && (
        <div className="bg-red-900 text-white p-4 rounded-md mb-6">
          Error: {error}
        </div>
      )}
      
      <MediaGallery 
        selectable
        multiple
        selectedFiles={selectedFiles}
        onSelect={setSelectedFiles}
      />
      
      {selectedFiles.length > 0 && (
        <div className="mt-6 flex items-center justify-between bg-gray-800 p-4 rounded-md">
          <div>
            <span className="text-gray-300">{selectedFiles.length} files selected</span>
          </div>
          <button 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            onClick={handleBulkDelete}
          >
            Delete Selected
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminMediaPage;