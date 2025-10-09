import React from 'react';
import { useNavigation } from '../../../hooks/useNavigation';
import SearchBar from './SearchBar';

const Menu: React.FC = () => {
  const { currentPage, navigateTo } = useNavigation();

  return (
    <div className="menu-row">
      <div 
        className={`pill ${currentPage === 'home' ? 'selected' : 'unselected'}`}
        onClick={() => navigateTo('home')}
      >
        Notícias
      </div>
      <div 
        className={`pill ${currentPage === 'podcasts' ? 'selected' : 'unselected'}`}
        onClick={() => navigateTo('podcasts')}
      >
        Podcasts
      </div>

      <SearchBar />
    </div>
  );
};

export default Menu;
