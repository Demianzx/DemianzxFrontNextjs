import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UsersClient, LoginUserCommand, RegisterUserCommand } from '../../services/api/web-api-client';
import apiClient from '../../services/api/apiClient';
import { jwtDecode } from 'jwt-decode';

// Interface para los datos decodificados del token JWT
interface JwtPayload {
  sub: string;
  email: string;
  role?: string;
  exp: number;
  name?: string;
}

interface AuthState {
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  } | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Función segura para obtener usuario del storage
const getUserFromStorage = (): AuthState['user'] => {
  if (typeof window === 'undefined') {
    return null; // Estamos en el servidor, no hay localStorage
  }
  
  const userString = localStorage.getItem('user');
  if (userString) {
    try {
      return JSON.parse(userString);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Estado inicial seguro para SSR
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  isLoading: false,
  error: null
};

// Inicialización del cliente de API
const usersClient = new UsersClient('', apiClient);

// Thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const loginCommand = new LoginUserCommand();
      loginCommand.userName = credentials.email;
      loginCommand.password = credentials.password;
      
      const response = await usersClient.loginUser(loginCommand);
      
      // Verificar que tenemos un token válido antes de procesarlo
      if (!response.token) {
        return rejectWithValue('No access token received from server');
      }
      
      // Guardar token en localStorage
      localStorage.setItem('token', response.token);
      
      try {
        // Decodificar token para obtener información del usuario
        const decodedToken = jwtDecode<JwtPayload>(response.token);
        
        // Crear objeto de usuario
        const user = {
          id: decodedToken.sub,
          email: decodedToken.email || credentials.email, 
          role: decodedToken.role || response.roles?.[0],
          name: decodedToken.name || response.userName
        };
        
        // Guardar información del usuario en localStorage
        localStorage.setItem('user', JSON.stringify(user));
        
        return {
          token: response.token,
          user
        };
      } catch (decodeError) {
        console.error("Error decoding token:", decodeError);
        
        // Si no podemos decodificar el token, usamos los datos de la respuesta
        const user = {
          id: 'unknown',
          email: credentials.email,
          role: response.roles?.[0],
          name: response.userName || undefined
        };
        
        // Guardar información del usuario en localStorage incluso con error
        localStorage.setItem('user', JSON.stringify(user));
        
        return {
          token: response.token,
          user
        };
      }
    } catch (error: any) {
      // Manejo detallado del error
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400 && data && data.title) {
          return rejectWithValue(data.title);
        }
        
        if (data && data.errors && Array.isArray(data.errors)) {
          return rejectWithValue(data.errors.join(', '));
        }
      }
      
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: { userName: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const registerUserCommand = new RegisterUserCommand();
      registerUserCommand.userName = userData.userName;
      registerUserCommand.email = userData.email;
      registerUserCommand.password = userData.password;
      
      await usersClient.registerUser(registerUserCommand);
      
      return { success: true };
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        if (errorData.errors) {
          let errorMessage = "";
          
          if (typeof errorData.errors === 'object') {
            Object.entries(errorData.errors).forEach(([key, value]: [string, any]) => {
              if (Array.isArray(value)) {
                errorMessage += `${value.join(', ')} `;
              } else {
                errorMessage += `${value} `;
              }
            });
          } else if (Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors.join(', ');
          }
          
          return rejectWithValue(errorMessage.trim() || 'Registration failed');
        }
        
        if (errorData.title) {
          return rejectWithValue(errorData.title);
        }
      }
      
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      // Solo ejecutar en el cliente
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('rol');
        localStorage.removeItem('email');
      }
      
      // Restablecer el estado
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      // Solo ejecutar en el cliente
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const user = getUserFromStorage();
        
        if (token) {
          try {
            const decodedToken = jwtDecode<JwtPayload>(token);
            // Verificar si el token no ha expirado
            if (decodedToken.exp * 1000 > Date.now()) {
              state.token = token;
              state.user = user || {
                id: decodedToken.sub,
                email: decodedToken.email,
                role: decodedToken.role,
                name: decodedToken.name
              };
              state.isAuthenticated = true;
            } else {
              // Si el token ha expirado, limpiamos el localStorage
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('rol');
              localStorage.removeItem('email');
            }
          } catch (e) {
            // Si hay algún error al decodificar el token, limpiamos el localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('rol');
            localStorage.removeItem('email');
          }
        }
      }
    }
  },
  extraReducers: (builder) => {
    // Manejar login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token || null;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Login failed';
      })

    // Manejar registerUser
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        // No cambiamos el estado de autenticación, ya que el usuario aún debe iniciar sesión
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Registration failed';
      });
  }
});

export const { logout, clearAuthError, initializeAuth } = authSlice.actions;

export default authSlice.reducer;