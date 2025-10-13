import React from 'react';
import UserDropdown from './UserDropdown';
//import NotificationDropdown from './NotificationDropdown';
import AppLogo from '../../../assets/images/logo.png'; 

const Header: React.FC = () => {
  return (
    <header className="app-header" aria-label="App header">
      <div className="left">
        <img src={AppLogo} alt="Logo do Bioclube" className="bioclube-logo" />
      </div>
      <div className="header-right">
        <UserDropdown />
      </div>
    </header>
  );
};

export default Header;