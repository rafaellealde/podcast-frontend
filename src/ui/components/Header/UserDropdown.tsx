import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import userIcon from '../../../assets/images/icon-user.png';
import { useNavigation } from '../../../hooks/useNavigation';
import './Header.css';

const UserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { navigateTo } = useNavigation();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    navigateTo('login');
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    navigateTo('register'); // Adicione esta função
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

  return (
    <div className="user-wrap">
      <button 
        className="icon-btn" 
        onClick={toggleDropdown}
        aria-haspopup="true" 
        aria-expanded={isOpen}
        title="Usuário"
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
            <a href="#" onClick={handleRegisterClick}>Cadastrar</a> {/* Adicione esta linha */}
          </>
        )}
      </div>
    </div>
  );
};

export default UserDropdown;