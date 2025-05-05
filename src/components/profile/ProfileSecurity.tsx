"use client";

import React, { useState } from 'react';
import Button from '../common/Button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { changePassword, clearAuthError } from '../../store/slices/authSlice';

const ProfileSecurity: React.FC = () => {
  const dispatch = useAppDispatch();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Obtener el estado de carga y error del slice de autenticación
  const { isLoading, error } = useAppSelector(state => state.auth);
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset messages
    setValidationError(null);
    setSuccess(null);
    dispatch(clearAuthError());
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setValidationError("New passwords don't match");
      return;
    }
    
    if (newPassword.length < 8) {
      setValidationError("New password must be at least 8 characters long");
      return;
    }
    
    // Check additional validation requirements
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
    
    if (!hasUpperCase || !hasNumber || !hasSpecial) {
      setValidationError(
        "Password must contain at least one uppercase letter, one number, and one special character"
      );
      return;
    }
    
    try {
      // Dispatch the changePassword thunk
      const result = await dispatch(changePassword({ 
        currentPassword, 
        newPassword 
      })).unwrap();
      
      // Si llegamos aquí, la operación fue exitosa
      setSuccess("Password changed successfully");
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      // El error ya estará en el estado de Redux, no necesitamos hacer nada aquí
      console.error("Error changing password:", err);
    }
  };
  
  // Determinar qué mensaje de error mostrar (validación local o error del servidor)
  const errorMessage = validationError || error;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Change Password</h3>
        
        {errorMessage && (
          <div className="bg-red-900 text-red-200 p-3 rounded-md mb-4">
            {errorMessage}
          </div>
        )}
        
        {success && (
          <div className="bg-green-900 text-green-200 p-3 rounded-md mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-gray-400 mb-2">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="newPassword" className="block text-gray-400 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-400 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="mt-2 text-sm">
            <div className={`flex items-center ${newPassword.length >= 8 ? 'text-green-400' : 'text-gray-500'}`}>
              <span className="mr-2">{newPassword.length >= 8 ? '✓' : '○'}</span>
              <span>At least 8 characters</span>
            </div>
            <div className={`flex items-center ${/[A-Z]/.test(newPassword) ? 'text-green-400' : 'text-gray-500'}`}>
              <span className="mr-2">{/[A-Z]/.test(newPassword) ? '✓' : '○'}</span>
              <span>At least one uppercase letter</span>
            </div>
            <div className={`flex items-center ${/[0-9]/.test(newPassword) ? 'text-green-400' : 'text-gray-500'}`}>
              <span className="mr-2">{/[0-9]/.test(newPassword) ? '✓' : '○'}</span>
              <span>At least one number</span>
            </div>
            <div className={`flex items-center ${/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-400' : 'text-gray-500'}`}>
              <span className="mr-2">{/[^A-Za-z0-9]/.test(newPassword) ? '✓' : '○'}</span>
              <span>At least one special character</span>
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Changing Password...' : 'Change Password'}
          </Button>
        </form>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Two-Factor Authentication</h3>
        <p className="text-gray-400 mb-4">
          Add an extra layer of security to your account by enabling two-factor authentication.
        </p>
        
        <Button variant="outline">
          Enable Two-Factor Authentication
        </Button>
      </div>
    </div>
  );
};

export default ProfileSecurity;