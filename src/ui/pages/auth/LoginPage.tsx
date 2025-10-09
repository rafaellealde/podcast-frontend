import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigation } from '../../../hooks/useNavigation';
import { useAuth } from '../../../hooks/useAuth';
import userIcon from '../../../assets/images/icon-user.png';

const LoginPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(formData);
      // Redirecionar para home após login bem-sucedido
      navigateTo('home');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateTo('register');
  };

  return (
    <div className="login-page-body">
      <div className="form-card-container">
        <div className="user-icon-container">
          <img 
            src={userIcon} 
            alt="Ícone do usuário" 
            className="user-icon"
          />
        </div>
        <h2>ENTRAR</h2>
        
        {error && (
          <div className="error-message">
            <strong>Erro:</strong> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite seu email"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={loading}
            />
            <label htmlFor="rememberMe">Lembrar de mim</label>
          </div>
          <button type="submit" disabled={loading} className={loading ? 'loading' : ''}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div className="link-container">
          Não tem uma conta? <a href="#" onClick={handleRegisterClick}>Cadastre-se</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;