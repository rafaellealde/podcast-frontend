import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentPodcast } from '../../hooks/useCurrentPodcast'; // Importe o hook
import Menu from '../components/Menu/Menu';
import PlayerCard from '../components/Player/PlayerCard';
import MiniPlayer from '../components/Player/MiniPlayer';

const PlaybackPage: React.FC = () => {
  const { user } = useAuth();
  const { currentPodcast } = useCurrentPodcast(); // Use o hook

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
        {hasValidPodcast ? (
          <PlayerCard 
            title={currentPodcast.titulo}
            subtitle={currentPodcast.descricao || 'Sem descrição'}
            imageUrl={currentPodcast.capaUrl || ''}
          />
        ) : (
          <PlayerCard 
            title="Nenhum podcast selecionado"
            subtitle="Selecione um podcast na página de podcasts"
            imageUrl=""
          />
        )}
        
        {/* Sempre renderize o MiniPlayer - ele vai se comportar conforme o currentPodcast */}
        <div className="audio-section">
          <MiniPlayer />
        </div>
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