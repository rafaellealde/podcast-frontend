import React, { useRef } from 'react';
import PodcastCard, { type PodcastItem } from './PodcastCard';
import FancyCarouselArrow from '../common/FancyCarouselArrow';
import './PodcastCarousel.css';
import { useNavigation } from '../../../hooks/useNavigation';
import { usePodcasts } from '../../../hooks/usePodcasts';

const PodcastCarousel: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { podcasts, loading, error } = usePodcasts();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'prev' | 'next') => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.offsetWidth;
      const scrollAmount = containerWidth / 2;
      if (direction === 'next') {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handlePodcastButtonClick = (podcast: PodcastItem) => {
    console.log(`Reproduzindo podcast: ${podcast.titulo}`, podcast);
    // Aqui você pode salvar o podcast selecionado no contexto ou localStorage
    // para usar na página de playback
    localStorage.setItem('currentPodcast', JSON.stringify(podcast));
    navigateTo('playback');
  };

  // Estados de loading e erro
  if (loading) {
    return (
      <div className="podcast-carousel">
        <div className="loading-state">
          <p>Carregando podcasts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="podcast-carousel">
        <div className="error-state">
          <p>Erro ao carregar podcasts: {error}</p>
        </div>
      </div>
    );
  }

  if (podcasts.length === 0) {
    return (
      <div className="podcast-carousel">
        <div className="empty-state">
          <p>Nenhum podcast disponível no momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="podcast-carousel">
      <div className="cards-row" ref={scrollRef}>
        {podcasts.map((item) => (
          <PodcastCard 
            key={item.id} 
            item={item}
            onButtonClick={() => handlePodcastButtonClick(item)}
            buttonText="Ouvir"
          />
        ))}
      </div>
      
      {podcasts.length > 2 && (
        <div className="carousel-controls">
          <FancyCarouselArrow direction="prev" onClick={() => handleScroll('prev')} />
          <FancyCarouselArrow direction="next" onClick={() => handleScroll('next')} />
        </div>
      )}
    </div>
  );
};

export default PodcastCarousel;