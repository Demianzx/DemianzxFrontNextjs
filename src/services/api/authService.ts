import { UsersClient, LoginUserCommand, RegisterUserCommand, ChangePasswordCommand } from './web-api-client';
import apiClient from './apiClient';

// Inicialización del cliente de usuarios
const usersClient = new UsersClient('', apiClient);

export const authService = {
  // Iniciar sesión
  async login(email: string, password: string) {
    const loginCommand = new LoginUserCommand();
    loginCommand.userName = email;
    loginCommand.password = password;
    
    return await usersClient.loginUser(loginCommand);
  },

  // Registrar un nuevo usuario
  async register(userName: string, email: string, password: string) {
    const registerCommand = new RegisterUserCommand();
    registerCommand.userName = userName;
    registerCommand.email = email;
    registerCommand.password = password;
    
    return await usersClient.registerUser(registerCommand);
  },

  // Cambiar contraseña
  async changePassword(currentPassword: string, newPassword: string) {
    const changePasswordCommand = new ChangePasswordCommand();
    changePasswordCommand.currentPassword = currentPassword;
    changePasswordCommand.newPassword = newPassword;
    
    return await usersClient.changePassword(changePasswordCommand);
  }
};