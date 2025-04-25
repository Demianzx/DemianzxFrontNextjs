"use client";

import React, { useState, useRef, useEffect } from 'react';

export interface Option {
  id: number | string;
  name: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedOptions: Option[];
  onChange: (selected: Option[]) => void;
  label: string;
  placeholder?: string;
  className?: string;
  allowCreate?: boolean;
  onCreateOption?: (name: string) => Promise<Option>;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedOptions,
  onChange,
  label,
  placeholder = 'Select options...',
  className = '',
  allowCreate = false,
  onCreateOption
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cerrar el menú cuando se hace clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filtrar opciones basadas en el término de búsqueda
  const filteredOptions = options.filter(option => 
    option.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    !selectedOptions.some(selected => selected.id === option.id)
  );
  
  // Manejar la selección de una opción
  const handleSelect = (option: Option) => {
    onChange([...selectedOptions, option]);
    setSearchTerm('');
    inputRef.current?.focus();
  };
  
  // Manejar la eliminación de una opción
  const handleRemove = (optionToRemove: Option) => {
    onChange(selectedOptions.filter(option => option.id !== optionToRemove.id));
  };
  
  // Manejar la creación de una nueva opción
  const handleCreateOption = async () => {
    if (!allowCreate || !onCreateOption || !searchTerm.trim()) return;
    
    setIsCreating(true);
    try {
      const newOption = await onCreateOption(searchTerm.trim());
      if (newOption) {
        handleSelect(newOption);
      }
    } catch (error) {
      console.error('Error creating option:', error);
    } finally {
      setIsCreating(false);
      setSearchTerm('');
    }
  };
  
  // Mostrar el campo de entrada al hacer clic en el componente
  const handleContainerClick = () => {
    setIsOpen(true);
    inputRef.current?.focus();
  };

  // Verificar si la opción de creación debería mostrarse
  const showCreateOption = allowCreate && 
                          searchTerm.trim() !== '' && 
                          !filteredOptions.some(option => 
                            option.name.toLowerCase() === searchTerm.toLowerCase()
                          );

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-lg mb-2">
        {label}
      </label>
      
      <div 
        ref={containerRef}
        className="bg-gray-800 border border-gray-700 rounded-md overflow-hidden"
        onClick={handleContainerClick}
      >
        {/* Área de selección/entrada */}
        <div className="p-2 flex flex-wrap">
          {selectedOptions.length === 0 && !isOpen && !searchTerm && (
            <div className="text-gray-400 py-1 px-2">{placeholder}</div>
          )}
          
          {/* Chips para opciones seleccionadas */}
          {selectedOptions.map(option => (
            <div 
              key={option.id} 
              className="bg-purple-700 text-white px-2 py-1 rounded m-1 flex items-center"
            >
              <span>{option.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(option);
                }}
                className="ml-2 text-purple-300 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          
          {/* Campo de búsqueda */}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-transparent border-none outline-none text-white py-1 px-2 min-w-[50px]"
            placeholder={selectedOptions.length > 0 ? "" : placeholder}
            onFocus={() => setIsOpen(true)}
          />
        </div>
        
        {/* Menú desplegable de opciones */}
        {isOpen && (
          <div className="border-t border-gray-700 max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              <ul>
                {filteredOptions.map(option => (
                  <li 
                    key={option.id}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleSelect(option)}
                  >
                    {option.name}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-2 text-gray-400">
                {showCreateOption ? 
                  `Press Enter to create "${searchTerm}"` : 
                  'No options available'}
              </div>
            )}
            
            {/* Opción para crear nuevo */}
            {showCreateOption && (
              <div 
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 cursor-pointer border-t border-gray-600 flex items-center"
                onClick={handleCreateOption}
              >
                {isCreating ? (
                  <span className="text-gray-300">Creating...</span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>Create `{searchTerm}`</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;