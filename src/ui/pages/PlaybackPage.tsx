import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Menu from '../components/Menu/Menu';
import PlayerCard from '../components/Player/PlayerCard';
import MiniPlayer from '../components/Player/MiniPlayer';
import type { PodcastItem } from '../../hooks/usePodcasts';

const PlaybackPage: React.FC = () => {
  const { user } = useAuth();
  const [currentPodcast, setCurrentPodcast] = useState<PodcastItem | null>(null);

  useEffect(() => {
    // Ler do localStorage temporariamente
    const savedPodcast = localStorage.getItem('currentPodcast');
    if (savedPodcast) {
      try {
        setCurrentPodcast(JSON.parse(savedPodcast));
      } catch (error) {
        console.error('Erro ao parsear podcast do localStorage:', error);
      }
    }
  }, []);

  const displayName = user?.name || 'visitante';
  const hasValidPodcast = currentPodcast && currentPodcast.titulo;

  return (
    <section className="screen" id="playbackScreen">
      <h1 className="hero-title">
        Olá <span className="username">{displayName}</span>,<br/>
        {hasValidPodcast ? 'Aproveite o podcast!' : 'Selecione um podcast para ouvir!'}
      </h1>

      <Menu />

      <div className="playback-content">
        {/* Passando as props necessárias para o PlayerCard */}
        {hasValidPodcast ? (
          <PlayerCard 
            title={currentPodcast.titulo}
            subtitle={currentPodcast.descricao || 'Sem descrição'}
            imageUrl={currentPodcast.capaUrl || ''}
          />
        ) : (
          <PlayerCard 
            title="Nenhum podcast selecionado"
            subtitle=""
            imageUrl="" // ou uma imagem padrão
          />
        )}
        
        {hasValidPodcast && currentPodcast.audioUrl && (
          <div className="audio-section">
            <MiniPlayer />
          </div>
        )}
      </div>

      {!hasValidPodcast && (
        <div className="no-podcast-selected">
          <p>Nenhum podcast selecionado. Volte à página de podcasts e clique em "Ouvir" em algum podcast para começar a ouvir.</p>
        </div>
      )}
    </section>
  );
};

export default PlaybackPage;