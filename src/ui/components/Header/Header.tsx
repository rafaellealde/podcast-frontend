import React from 'react';
import UserDropdown from './UserDropdown';
import AppLogo from '../../../assets/images/logo.png'; 
import { useNavigation } from '../../../hooks/useNavigation';
const Header: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <header className="app-header" aria-label="App header">
      <div className="left">
        <img
          src={AppLogo}
          alt="Logo do Bioclube"
          className="bioclube-logo cursor-pointer"
          onClick={() => navigateTo('home')}
        />
      </div>
      <div className="header-right">
        <UserDropdown />
      </div>
    </header>
  );
};

export default Header;