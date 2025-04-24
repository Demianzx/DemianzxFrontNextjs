"use client";

import { useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { initializeAuth } from '../../store/slices/authSlice';

const AuthInitializer: React.FC = () => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);
  
  return null; // Este componente no renderiza nada visualmente
};

export default AuthInitializer;