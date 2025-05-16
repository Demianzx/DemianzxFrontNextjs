import axios from 'axios';

// Configuración base de axios para todas las peticiones
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a todas las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // No sobreescribir Content-Type cuando sea multipart/form-data
    if (config.data instanceof FormData) {
      // Eliminar el Content-Type para que el navegador lo establezca con el boundary correcto
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API request error:', error);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      
      if (error.response.status === 401) {
        // Redirigir al login si hay problemas de autenticación
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;