import React, { useState } from 'react';
import './RegisterPage.css';
import { useNavigation } from '../../../hooks/useNavigation';
import { useAuth } from '../../../hooks/useAuth';
import userIcon from '../../../assets/images/icon-user.png';

const RegisterPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      await register(formData);
      setSuccess('Conta criada com sucesso! Redirecionando para login...');
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        navigateTo('login');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateTo('login');
  };

  return (
    <div className="register-page-body">
      <div className="register-content">
        <div className="form-card-container">
          <div className="user-icon-container">
            <img 
              src={userIcon} 
              alt="Ícone do usuário" 
              className="user-icon"
            />
          </div>
          
          <h2>CADASTRAR</h2>
          
          {error && (
            <div className="error-message">
              <strong>Erro:</strong> {error}
            </div>
          )}
          
          {success && (
            <div className="success-message">
              <strong>Sucesso:</strong> {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nome:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite seu nome completo"
                required
                disabled={loading}
              />
            </div>
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
                placeholder="Digite sua senha (mínimo 6 caracteres)"
                required
                disabled={loading}
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Senha:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                required
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading} className={loading ? 'loading' : ''}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
          <div className="link-container">
            Já tem uma conta? <a href="#" onClick={handleLoginClick}>Entrar</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;