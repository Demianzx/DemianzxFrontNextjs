"use client";

import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Hooks tipados para usar en lugar de los hooks básicos de React-Redux
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Hook para usar en páginas de servidor que detecta si estamos en el servidor
export const useAppSelectorSafe = <T>(selector: (state: RootState) => T, fallback: T): T => {
  try {
    return useSelector(selector);
  } catch (error) {
    if (typeof window === 'undefined') {
      // Estamos en el servidor, devolver el valor fallback
      return fallback;
    }
    // Estamos en el cliente, reenviar el error
    throw error;
  }
};