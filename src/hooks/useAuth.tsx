import React, { useState, createContext, useContext, type ReactNode, useEffect } from 'react';
import type { User, AuthFormData } from '../models/user';

interface AuthContextType {
  user: User | null;
  login: (credentials: AuthFormData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  register: (userData: AuthFormData) => Promise<void>;
  loading: boolean;
  initialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Função para salvar usuário no localStorage
  const saveUserToStorage = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Função para remover usuário do localStorage
  const removeUserFromStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Função para recuperar usuário do localStorage
  const getUserFromStorage = (): User | null => {
    try {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (savedUser && token) {
        const userData = JSON.parse(savedUser);
        return { ...userData, isLoggedIn: true };
      }
    } catch (error) {
      console.error('Erro ao recuperar usuário do localStorage:', error);
      removeUserFromStorage();
    }
    return null;
  };

  const login = async (credentials: AuthFormData) => {
    setLoading(true);
    try {
      console.log('Enviando login:', {
        email: credentials.email,
        senha: credentials.password
      });

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          senha: credentials.password
        }),
      });

      const responseText = await response.text();
      console.log('Resposta bruta:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Erro ao parsear JSON:', e);
        throw new Error('Resposta do servidor não é JSON válido');
      }

      console.log('Resposta parseada:', data);
      console.log('Status:', response.status);

      if (!response.ok) {
        throw new Error(data.message || data.title || `Erro ${response.status}: ${response.statusText}`);
      }

      const token = data.Token || data.token || data.accessToken;
      const usuarioData = data.Usuario || data.usuario || data.user || data;

      console.log('Token encontrado:', token);
      console.log('UsuarioData encontrado:', usuarioData);

      if (!token) {
        console.error('Nenhum token encontrado na resposta. Estrutura completa:', data);
        throw new Error('Token de autenticação não recebido');
      }

      // Criar objeto do usuário
      const userData: User = {
        id: (usuarioData.Id || usuarioData.id || '1').toString(),
        name: usuarioData.Nome || usuarioData.nome || 'Usuário',
        email: usuarioData.Email || usuarioData.email || credentials.email,
        isLoggedIn: true,
        role: (usuarioData.Role || usuarioData.role || 'user') as 'user' | 'admin'
      };

      // Salvar token e dados do usuário no localStorage
      localStorage.setItem('token', token);
      saveUserToStorage(userData);

      // Atualizar estado
      setUser(userData);
      console.log('Login realizado com sucesso:', userData);

    } catch (error) {
      console.error('Erro no login:', error);
      // Limpar storage em caso de erro
      removeUserFromStorage();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: AuthFormData) => {
    setLoading(true);
    try {
      if (userData.password !== userData.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      console.log('Enviando registro:', {
        nome: userData.name,
        email: userData.email,
        senha: userData.password
      });

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: userData.name,
          email: userData.email,
          senha: userData.password,
        }),
      });

      const responseText = await response.text();
      console.log('Resposta bruta do registro:', responseText);
      console.log('Status do registro:', response.status);

      if (response.status === 200 || response.status === 201) {
        console.log('Registro realizado com sucesso (resposta vazia)');
        return;
      }

      if (responseText && responseText.trim() !== '') {
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error('Erro ao parsear JSON:', e);
          throw new Error('Resposta do servidor não é JSON válido');
        }

        console.log('Resposta parseada do registro:', data);

        if (!response.ok) {
          throw new Error(data.message || data.title || `Erro ${response.status}: ${response.statusText}`);
        }

        console.log('Usuário registrado com sucesso:', data);
      } else if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeUserFromStorage();
    setUser(null);
    console.log('Logout realizado');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      saveUserToStorage(updatedUser); // Atualizar também no localStorage
    }
  };

  // Efeito para inicializar a autenticação quando o componente montar
  useEffect(() => {
    const initializeAuth = () => {
      const savedUser = getUserFromStorage();
      
      if (savedUser) {
        console.log('Usuário recuperado do localStorage:', savedUser);
        setUser(savedUser);
      } else {
        console.log('Nenhum usuário autenticado encontrado no localStorage');
        setUser(null);
      }
      
      setInitialized(true);
    };

    initializeAuth();
  }, []);

  const value = { 
    user, 
    login, 
    logout, 
    updateUser, 
    register, 
    loading, 
    initialized 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};