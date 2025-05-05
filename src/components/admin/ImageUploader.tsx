"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  label: string;
  height?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  imageUrl, 
  onImageChange, 
  label,
  height = 200 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función para manejar la carga de archivos
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validación del tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    // Simulación de carga (en un caso real, subiríamos a un servidor)
    setIsUploading(true);
    setError(null);
    
    try {
      // Aquí iría la lógica para subir la imagen al servidor
      // Por ahora simularemos la URL con FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        // En una implementación real, la URL vendría del servidor
        onImageChange(reader.result as string);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setError('Error reading file');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Error uploading image');
      setIsUploading(false);
    }
  };

  // Función para abrir el selector de archivos
  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  // Función para eliminar la imagen
  const handleRemoveImage = () => {
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <label className="block text-lg mb-2">
        {label}
      </label>
      
      <div className="bg-gray-800 border border-gray-700 rounded-md overflow-hidden">
        {imageUrl ? (
          <div className="relative">
            <div style={{ height: `${height}px` }} className="relative">
              <Image
                src={imageUrl}
                alt={label}
                className="object-cover"
                fill
                unoptimized={imageUrl.startsWith('data:')}
              />
            </div>
            <div className="absolute top-0 right-0 p-2 flex space-x-2">
              <button
                type="button"
                onClick={handleChooseImage}
                className="bg-gray-900 bg-opacity-70 text-white p-2 rounded-md hover:bg-opacity-100 transition-opacity"
                title="Change image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="bg-red-900 bg-opacity-70 text-white p-2 rounded-md hover:bg-opacity-100 transition-opacity"
                title="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={handleChooseImage}
            className="flex flex-col items-center justify-center p-6 cursor-pointer border-2 border-dashed border-gray-600 rounded-md hover:border-gray-500 transition-colors"
            style={{ height: `${height}px` }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {isUploading ? (
              <p className="text-gray-400">Subiendo...</p>
            ) : (
              <p className="text-gray-400">Clickea para subir {label.toLowerCase()}</p>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-red-500 mt-2 text-sm">{error}</p>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;