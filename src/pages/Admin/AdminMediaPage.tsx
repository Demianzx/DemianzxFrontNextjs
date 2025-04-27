"use client";

import React, { useState } from 'react';
import AdminSectionHeader from '../../components/admin/AdminSectionHeader';
import MediaGallery from '../../components/media/MediaGallery';
import { useAppSelector } from '../../store/hooks';

const AdminMediaPage: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const { isLoading, error } = useAppSelector(state => state.media);

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
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${selectedFiles.length} files?`)) {
                console.log('Delete files:', selectedFiles);
                // Implementación real de eliminación masiva
                setSelectedFiles([]);
              }
            }}
          >
            Delete Selected
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminMediaPage;