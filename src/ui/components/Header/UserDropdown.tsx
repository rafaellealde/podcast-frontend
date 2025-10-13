import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import userIcon from '../../../assets/images/icon-user.png';
import { useNavigation } from '../../../hooks/useNavigation';
import './Header.css';

const UserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, initialized } = useAuth();
  const { navigateTo } = useNavigation();

  const toggleDropdown = () => {
    if (initialized) {
      setIsOpen(!isOpen);
    }
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    navigateTo('login');
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    navigateTo('register');
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigateTo('home');
  };

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    navigateTo('admin');
  };

  const isAdmin = user?.role === 'admin';

  // Mostrar loading enquanto a autenticação não foi inicializada
  if (!initialized) {
    return (
      <div className="user-wrap">
        <button 
          className="icon-btn" 
          title="Carregando..."
          disabled
        >
          <img src={userIcon} alt="Carregando..." />
        </button>
      </div>
    );
  }

  return (
    <div className="user-wrap">
      <button 
        className="icon-btn" 
        onClick={toggleDropdown}
        aria-haspopup="true" 
        aria-expanded={isOpen}
        title={user?.isLoggedIn ? `Usuário: ${user.name}` : 'Usuário'}
      >
        <img src={userIcon} alt="Usuário" />
      </button>
      
      <div className={`dropdown user-dropdown ${isOpen ? 'show' : ''}`}>
        {user?.isLoggedIn ? (
          <>
            <div className="user-info">
              <span>Olá, {user.name}</span>
              <small>{user.email}</small>
              {isAdmin && <small className="admin-badge">Administrador</small>}
            </div>
            
            {isAdmin && (
              <a href="#" onClick={handleAdminClick}>
                Tela Admin
              </a>
            )}
            
            <a href="#" onClick={handleLogout}>Sair</a>
          </>
        ) : (
          <>
            <a href="#" onClick={handleLoginClick}>Acessar</a>
            <a href="#" onClick={handleRegisterClick}>Cadastrar</a>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDropdown;