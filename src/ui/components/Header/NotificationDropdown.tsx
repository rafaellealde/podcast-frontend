import React from 'react';
import bellIcon from '../../../assets/images/icon-bell.png';
import './Header.css';

const NotificationDropdown: React.FC = () => {
  return (
    <div className="notification-wrap">
      <button className="icon-btn" title="Notificações">
        <img src={bellIcon} alt="Notificações" />
      </button>
    </div>
  );
};

export default NotificationDropdown;