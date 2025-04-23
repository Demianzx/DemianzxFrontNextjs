import React, { useState, useEffect, useRef } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useAppSelector } from '../../store/hooks';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const modalRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  
  // Cerrar el modal si el usuario se autentica correctamente
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose]);
  
  // Cerrar el modal al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md overflow-hidden"
      >
        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          <button
            className={`flex-1 py-4 font-medium text-center ${
              activeTab === 'login' 
                ? 'text-white border-b-2 border-purple-600' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 py-4 font-medium text-center ${
              activeTab === 'register' 
                ? 'text-white border-b-2 border-purple-600' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {activeTab === 'login' ? (
            <LoginForm onClose={onClose} />
          ) : (
            <RegisterForm onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;