import React from 'react';
import UserDropdown from './UserDropdown';
import NotificationDropdown from './NotificationDropdown';

const Header: React.FC = () => {
  return (
    <header className="app-header" aria-label="App header">
      <div className="left">
        <UserDropdown />
      </div>
      <div className="header-right">
        <NotificationDropdown />
      </div>
    </header>
  );
};

export default Header;
