import React, { useRef, useEffect } from 'react';
import NewsCard from './NewsCard';
import FancyCarouselArrow from '../common/FancyCarouselArrow';
import './NewsCarousel.css';
import { useNews } from '../../../hooks/useNews';

const NewsCarousel: React.FC = () => {
  const { news, loading, error } = useNews();
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

  // Se não há notícias, mostrar estado vazio
  if (loading) {
    return (
      <div className="news-carousel">
        <div className="loading-state">
          <p>Carregando notícias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-carousel">
        <div className="error-state">
          <p>Erro ao carregar notícias: {error}</p>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="news-carousel">
        <div className="empty-state">
          <p>Nenhuma notícia disponível no momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="news-carousel">
      <div className="cards-row" ref={scrollRef}>
        {news.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
      
      {news.length > 2 && (
        <div className="carousel-controls">
          <FancyCarouselArrow direction="prev" onClick={() => handleScroll('prev')} />
          <FancyCarouselArrow direction="next" onClick={() => handleScroll('next')} />
        </div>
      )}
    </div>
  );
};

export default NewsCarousel;