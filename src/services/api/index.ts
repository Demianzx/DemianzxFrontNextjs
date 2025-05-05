export * from './blogPostService';
export * from './categoryService';
export * from './tagService';
export * from './MediaService';
export * from './adapters/blogPostAdapter';
export * from './adapters/categoryAdapter';
export * from './adapters/tagAdapter';
export * from './adapters/mediaAdapter';
export * from './authService';

// También exportamos el cliente API para usarlo directamente si es necesario
export { default as apiClient } from './apiClient';