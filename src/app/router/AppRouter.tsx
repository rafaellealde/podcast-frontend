import React from 'react';
import { useNavigation } from '../../hooks/useNavigation';
import HomePage from '../../ui/pages/HomePage';
import PodcastPage from '../../ui/pages/PodcastPage';
import PlaybackPage from '../../ui/pages/PlaybackPage';
import MainLayout from '../../ui/layouts/MainLayout';
import LoginPage from '../../ui/pages/auth/LoginPage';
import AdminPage from '../../ui/pages/AdminPage';
import RegisterPage from '../../ui/pages/auth/RegisterPage';


const AppRouter: React.FC = () => {
  const { currentPage } = useNavigation();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'podcasts':
        return <PodcastPage />;
      case 'playback':
        return <PlaybackPage />;
      case 'login':
        return <LoginPage />;
      case 'admin':
        return <AdminPage />;
      case 'register':
        return <RegisterPage />;
      default:
        return <HomePage />;
    }
  };

  const page = renderPage();

  if (['login', 'register'].includes(currentPage)) {
    return page;
  }

  return <MainLayout>{page}</MainLayout>;
};

export default AppRouter;