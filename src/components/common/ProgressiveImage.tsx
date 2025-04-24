"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [blurUrl, setBlurUrl] = useState("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E");

  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  return (
    <div className="relative overflow-hidden w-full h-full">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-900 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width || 1200}  // Debemos proporcionar un ancho y alto para Next Image
        height={height || 800}
        placeholder="blur"
        blurDataURL={blurUrl}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
        // Estas opciones hacen que Image se comporte más como img nativo
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        fill={!width || !height} // Si no se proporcionan dimensiones, usar fill
      />
    </div>
  );
};

export default ProgressiveImage;