import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Menu from '../components/Menu/Menu';
import PodcastCarousel from '../components/Podcast/PodcastCarousel';

const PodcastPage: React.FC = () => {
  const { user } = useAuth();
  
  const userName = user?.name || 'Visitante';

  return (
    <section className="screen" id="podcastScreen">
      <h1 className="hero-title">
        Olá <span className="username">{userName}</span>, seja bem vindo de volta!<br/>
        Confira nossos podcasts exclusivos!
      </h1>

      <Menu />
      <PodcastCarousel />
    </section>
  );
};

export default PodcastPage;