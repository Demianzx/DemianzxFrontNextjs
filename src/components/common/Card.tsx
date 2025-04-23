import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${className}`}>
      {children}
    </div>
  );
};

export default Card;