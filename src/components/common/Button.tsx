import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean; // Añadimos la propiedad disabled
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false, // Valor predeterminado
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none';
  
  const variantClasses = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white',
    outline: 'bg-transparent border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'
  };
  
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-5 py-2.5',
    lg: 'text-lg px-6 py-3'
  };
  
  // Añadir clases para el estado deshabilitado
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;
  
  return (
    <button 
      className={classes} 
      onClick={onClick} 
      type={type} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;