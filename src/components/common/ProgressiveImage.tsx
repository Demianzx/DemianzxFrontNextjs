import React, { useState, useEffect } from 'react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({ src, alt, className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <div className="relative overflow-hidden w-full h-full">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-900 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />
    </div>
  );
};

export default ProgressiveImage;