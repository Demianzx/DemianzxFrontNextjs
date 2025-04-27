"use client";

import React, { useState, useRef } from 'react';
import { useAppSelector } from '../../store/hooks';

interface MediaUploaderProps {
  onUpload: (file: File) => void;
  onClose: () => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUpload,
  onClose
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { currentUpload } = useAppSelector(state => state.media);
  
  // Manejar el cambio en el input de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Manejar el drop de archivos
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };
  
  // Manejar inicio de arrastre
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  
  // Manejar salida de arrastre
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  
  // Prevenir comportamiento por defecto
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  // Manejar clic en el botón de selección de archivo
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  // Manejar subida de archivo
  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="bg-gray-800 rounded-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Upload Media</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div
        className={`border-2 border-dashed rounded-md p-8 text-center ${
          dragActive ? 'border-purple-500 bg-purple-500 bg-opacity-10' : 'border-gray-600'
        }`}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
      >
        {currentUpload.isUploading ? (
          <div className="space-y-4">
            <p className="text-gray-300">Uploading {currentUpload.fileName}...</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-purple-600 h-2.5 rounded-full" 
                style={{ width: `${currentUpload.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">{currentUpload.progress}% Complete</p>
          </div>
        ) : selectedFile ? (
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-md inline-block mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-300">{selectedFile.name}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleUpload}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Upload
              </button>
              <button
                onClick={() => setSelectedFile(null)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-300 mb-4">Drag & drop files here, or click to select files</p>
            <button
              onClick={handleButtonClick}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Select Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        <p>Supported file types: JPG, PNG, GIF, SVG</p>
        <p>Maximum file size: 5MB</p>
      </div>
    </div>
  );
};

export default MediaUploader;