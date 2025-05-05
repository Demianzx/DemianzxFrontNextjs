"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { MediaFile } from '../../services/api/adapters/mediaAdapter';

interface MediaItemProps {
  file: MediaFile;
  isSelected?: boolean;
  selectable?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

const MediaItem: React.FC<MediaItemProps> = ({
  file,
  isSelected = false,
  selectable = false,
  onSelect,
  onDelete
}) => {
  const [isHovering, setIsHovering] = useState(false);
  
  // Determinar si es una imagen basado en el tipo de contenido
  const isImage = file.contentType.startsWith('image/');
  
  // Formatear el tamaño del archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      className={`relative rounded-md overflow-hidden transition-all duration-200 ${
        selectable ? 'cursor-pointer' : ''
      } ${isSelected ? 'ring-4 ring-purple-500 shadow-lg transform scale-102' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={selectable ? onSelect : undefined}
    >
      {/* Contenido del archivo */}
      <div className="bg-gray-800 h-40 flex items-center justify-center">
        {isImage ? (
          <Image
            src={file.uri}
            alt={file.name}
            width={200}
            height={160}
            className="object-cover w-full h-full"
            unoptimized
          />
        ) : (
          <div className="text-center p-4">
            <div className="bg-gray-700 p-4 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm truncate block">{file.name}</span>
          </div>
        )}
      </div>
      
      {/* Overlay de información */}
      {isHovering && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col">
          <div className="p-2 flex-grow flex flex-col justify-center items-center text-center">
            <p className="text-sm font-medium truncate mb-1 max-w-full">{file.name}</p>
            <p className="text-xs text-gray-400 mb-2">{formatFileSize(file.size)}</p>
          </div>
          
          <div className="p-2 bg-gray-900 flex justify-between">
            {selectable && (
              <button 
                className={`${isSelected ? 'text-purple-400 hover:text-purple-300' : 'text-gray-400 hover:text-white'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelect) onSelect();
                }}
              >
                {isSelected ? 'Selected' : 'Select'}
              </button>
            )}
            
            {onDelete && (
              <button 
                className="text-red-400 hover:text-red-300 ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                Borrar
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Indicador de selección más visible */}
      {selectable && isSelected && (
        <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default MediaItem;