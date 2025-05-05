"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getValidImageUrl } from '../../utils/imageUtils';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({ 
  src, 
  alt, 
  className = '',
  width = 0, 
  height = 0 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [blurUrl] = useState("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E");

  useEffect(() => {
    // Validar y corregir la URL de la imagen
    setImageSrc(getValidImageUrl(src));
    setIsLoaded(false);
  }, [src]);

  // Si aún no tenemos una URL válida, mostrar el placeholder mientras se procesa
  if (!imageSrc) {
    return (
      <div className="relative overflow-hidden w-full h-full">
        <div className="absolute inset-0 bg-gray-900 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden w-full h-full">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-900 animate-pulse" />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        width={width || 1200}
        height={height || 800}
        placeholder="blur"
        blurDataURL={blurUrl}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        fill={!width || !height}
        unoptimized={true} // Usar unoptimized para todas las imágenes externas
      />
    </div>
  );
};

export default ProgressiveImage;