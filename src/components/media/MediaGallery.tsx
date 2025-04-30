"use client";

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMediaFiles, uploadMediaFile, deleteMediaFile } from '../../store/slices/mediaSlice';
import MediaGrid from './MediaGrid';
import MediaUploader from './MediaUploader';

interface MediaGalleryProps {
  selectable?: boolean;
  multiple?: boolean;
  selectedFiles?: string[];
  onSelect?: (files: string[]) => void;
  onFileSelected?: (fileUrl: string, fileName: string) => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({
  selectable = false,
  multiple = false,
  selectedFiles = [],
  onSelect = () => {},
  onFileSelected
}) => {
  const dispatch = useAppDispatch();
  const { files, isLoading } = useAppSelector(state => state.media);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMediaFiles());
  }, [dispatch]);

  const handleFileUpload = async (file: File) => {
    try {
      await dispatch(uploadMediaFile(file)).unwrap();
      
      setTimeout(() => {
        dispatch(fetchMediaFiles());
        setIsUploaderOpen(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  const handleDeleteFile = async (blobName: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      try {
        await dispatch(deleteMediaFile(blobName)).unwrap();
        
        if (selectedFiles.includes(blobName)) {
          const updatedSelection = selectedFiles.filter(name => name !== blobName);
          onSelect(updatedSelection);
        }
      } catch (error) {
        console.error('Failed to delete file:', error);
      }
    }
  };

  const handleSelect = (fileUrl: string, fileName: string) => {
    if (!selectable) {
      return;
    }

    if (multiple) {
      if (selectedFiles.includes(fileName)) {
        onSelect(selectedFiles.filter(file => file !== fileName));
      } else {
        onSelect([...selectedFiles, fileName]);
      }
    } else {
      onSelect([fileName]);
      
      if (onFileSelected) {
        onFileSelected(fileUrl, fileName); 
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <button
          id="media-upload-button"
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          onClick={() => setIsUploaderOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Upload Media
        </button>
        
        {/* Añadir más filtros aquí si es necesario */}
      </div>
      
      {isUploaderOpen && (
        <MediaUploader 
          onUpload={handleFileUpload}
          onClose={() => setIsUploaderOpen(false)}
        />
      )}
      
      <MediaGrid 
        files={files}
        isLoading={isLoading}
        selectable={selectable}
        selectedFiles={selectedFiles}
        onSelect={handleSelect}
        onDelete={handleDeleteFile}
      />
    </div>
  );
};

export default MediaGallery;