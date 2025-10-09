import React, { useState, createContext, useContext, type ReactNode } from 'react';
import type { User, AuthFormData } from '../models/user';

interface AuthContextType {
  user: User | null;
  login: (credentials: AuthFormData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  register: (userData: AuthFormData) => Promise<void>;
  loading: boolean;
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

  const login = async (credentials: AuthFormData) => {
    setLoading(true);
    try {
      console.log('Enviando login:', {
        Email: credentials.email,
        Senha: credentials.password
      });

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: credentials.email,
          Senha: credentials.password
        }),
      });

      // Primeiro obtenha o texto bruto para debug
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

      // Tratamento flexível para diferentes estruturas de resposta
      const token = data.Token || data.token || data.accessToken;
      const usuarioData = data.Usuario || data.usuario || data.user || data;

      console.log('Token encontrado:', token);
      console.log('UsuarioData encontrado:', usuarioData);

      if (!token) {
        console.error('Nenhum token encontrado na resposta. Estrutura completa:', data);
        throw new Error('Token de autenticação não recebido');
      }

      // Salvar token no localStorage
      localStorage.setItem('token', token);
      
      // Criar usuário com dados disponíveis (mais flexível)
      const userData: User = {
        id: (usuarioData.Id || usuarioData.id || '1').toString(),
        name: usuarioData.Nome || usuarioData.nome || 'Usuário',
        email: usuarioData.Email || usuarioData.email || credentials.email,
        isLoggedIn: true,
        role: (usuarioData.Role || usuarioData.role || 'user') as 'user' | 'admin' // Adicione esta linha
      };
      
      setUser(userData);
      console.log('Login realizado com sucesso:', userData);
      
    } catch (error) {
      console.error('Erro no login:', error);
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
        Nome: userData.name,
        Email: userData.email,
        Senha: userData.password,
        ConfirmarSenha: userData.confirmPassword
      });

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Nome: userData.name,
          Email: userData.email,
          Turma: 'default',
          Senha: userData.password,
          ConfirmarSenha: userData.confirmPassword
        }),
      });

      const responseText = await response.text();
      console.log('Resposta bruta do registro:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Resposta do servidor não é JSON válido');
      }

      console.log('Resposta parseada do registro:', data);

      if (!response.ok) {
        throw new Error(data.message || data.title || `Erro ${response.status}: ${response.statusText}`);
      }

      console.log('Usuário registrado com sucesso:', data);
      
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token encontrado no localStorage');
      // Aqui você pode adicionar lógica para validar o token
      // e buscar os dados do usuário (incluindo role) se necessário
    }
  }, []);

  const value = { user, login, logout, updateUser, register, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};