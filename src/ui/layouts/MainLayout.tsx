import React from 'react';
import Header from '../components/Header/Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="page">
      <Header />
      {children}
    </div>
  );
};

export default MainLayout;