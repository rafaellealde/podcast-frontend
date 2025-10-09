export interface User {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
  role: 'user' | 'admin'; // Adicione esta linha
}

export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  rememberMe: boolean;
}