import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, clearAuthError } from '../../store/slices/authSlice';

interface LoginFormProps {
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { isLoading, error } = useAppSelector(state => state.auth);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpiar cualquier error previo
    dispatch(clearAuthError());
    
    // Intentar iniciar sesión
    const result = await dispatch(login({ email, password }));
    
    if (login.fulfilled.match(result)) {
      // Cerrar el modal si la autenticación fue exitosa
      onClose();
    }
  };
  
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
      
      {error && (
        <div className="bg-red-900 text-red-200 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-400 mb-2">
            User
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-400 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md transition-colors font-medium"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      
      <div className="mt-6 text-center text-gray-400">
        <p>Or log in with</p>
        <div className="flex justify-center space-x-4 mt-4">
          <button className="bg-gray-800 hover:bg-gray-700 w-12 h-12 rounded-md flex items-center justify-center transition-colors">
            <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
            </svg>
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 w-12 h-12 rounded-md flex items-center justify-center transition-colors">
            <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.84 9.49.5.09.68-.22.68-.485 0-.236-.008-.866-.013-1.7-2.782.603-3.37-1.34-3.37-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.07-.608.07-.608 1.004.07 1.532 1.03 1.532 1.03.89 1.53 2.34 1.09 2.91.833.09-.647.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.09.39-1.984 1.03-2.682-.104-.254-.448-1.27.096-2.646 0 0 .84-.27 2.75 1.025.8-.223 1.654-.333 2.504-.337.85.004 1.705.114 2.504.336 1.91-1.294 2.748-1.025 2.748-1.025.546 1.376.202 2.394.1 2.646.64.7 1.03 1.592 1.03 2.682 0 3.84-2.337 4.687-4.565 4.934.359.31.678.92.678 1.855 0 1.337-.012 2.415-.012 2.75 0 .266.18.578.688.48C19.138 20.16 22 16.416 22 12c0-5.523-4.477-10-10-10z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;