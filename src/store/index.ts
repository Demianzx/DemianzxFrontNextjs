import { configureStore } from '@reduxjs/toolkit';
import blogsReducer from './slices/blogsSlice';
import categoriesReducer from './slices/categoriesSlice';
import tagsReducer from './slices/tagsSlice';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import mediaReducer from './slices/mediaSlice';

export const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    categories: categoriesReducer,
    tags: tagsReducer,
    auth: authReducer,
    ui: uiReducer,
    media: mediaReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Permite objetos no serializables como fechas
    }),
  // Añadir esta opción para evitar errores en modo de desarrollo con SSR
  devTools: typeof window !== 'undefined',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;