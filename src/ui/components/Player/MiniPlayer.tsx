import React, { useState, useRef, useEffect } from 'react';
import { useCurrentPodcast } from '../../../hooks/useCurrentPodcast';
import './MiniPlayer.css';

const MiniPlayer: React.FC = () => {
  const { currentPodcast } = useCurrentPodcast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Debug: verificar o que está vindo do hook
  useEffect(() => {
    console.log('🎵 CurrentPodcast do hook:', currentPodcast);
  }, [currentPodcast]);

  // Carregar áudio quando o podcast mudar
  useEffect(() => {
    if (currentPodcast && audioRef.current) {
      console.log('🚀 Iniciando carregamento do áudio:', currentPodcast.audioUrl);
      
      setIsLoading(true);
      setError(null);

      if (!currentPodcast.audioUrl) {
        setError('URL do áudio não disponível');
        setIsLoading(false);
        return;
      }

      audioRef.current.src = currentPodcast.audioUrl;
      audioRef.current.preload = 'metadata';
      audioRef.current.load();

      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [currentPodcast]);

  const togglePlayPause = async () => {
    if (!audioRef.current || !currentPodcast || !currentPodcast.audioUrl) {
      console.log('❌ Não pode reproduzir - dados insuficientes');
      return;
    }

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        console.log('⏸️ Áudio pausado');
      } else {
        console.log('▶️ Iniciando reprodução...');
        
        if (audioRef.current.readyState < 2) {
          console.log('🔄 Áudio não pronto, recarregando...');
          audioRef.current.load();
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        await audioRef.current.play();
        setIsPlaying(true);
        console.log('✅ Reprodução iniciada!');
      }
    } catch (playError) {
      console.error('❌ Erro na reprodução:', playError);
      setError(`Erro: ${playError instanceof Error ? playError.message : 'Falha na reprodução'}`);
      setIsPlaying(false);
    }
  };

  // Atualizar o tempo do áudio
  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  // Função para formatar tempo
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Clique na barra de progresso
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressBarRef.current || !duration) return;
    
    e.stopPropagation();
    
    const progressContainer = progressBarRef.current;
    const clickX = e.nativeEvent.offsetX;
    const width = progressContainer.clientWidth;
    const clickPercent = clickX / width;
    
    const newTime = clickPercent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Handler para erros de áudio
  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const audio = e.target as HTMLAudioElement;
    console.error('❌ Erro no elemento de áudio:', audio.error);
    setError('Erro ao carregar áudio');
    setIsPlaying(false);
    setIsLoading(false);
  };

  // Se não há podcast selecionado, mostrar card desativado
  if (!currentPodcast) {
    return (
      <div className="music-card disabled">
        <div className="card-header">
          <div className="track-info">
            <svg
              className="track-icon"
              fill="none"
              height="18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
            <div className="track-details">
              <span className="track-title">Nenhum podcast selecionado</span>
              <p className="track-artist">Selecione um podcast para ouvir</p>
            </div>
          </div>
        </div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: '0%' }}></div>
        </div>
        <div className="progress-time">
          <span>0:00</span>
          <span>0:00</span>
        </div>
      </div>
    );
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`music-card ${isPlaying ? 'playing' : ''} ${isLoading ? 'loading' : ''}`}>
      <div className="card-header" onClick={togglePlayPause}>
        <div className="track-info">
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : (
            <svg
              className="track-icon"
              fill="none"
              height="18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="18"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isPlaying ? (
                <>
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </>
              ) : (
                <path d="M9 18V5l12-2v13"></path>
              )}
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          )}
          <div className="track-details">
            <span className="track-title">{currentPodcast.titulo}</span>
            <p className="track-artist">
              {isLoading ? 'Carregando...' : 
               error ? `Erro: ${error}` :
               isPlaying ? 'Reproduzindo...' : 'Clique para reproduzir'}
            </p>
          </div>
        </div>
      </div>
      
      <div 
        className="progress-container" 
        ref={progressBarRef}
        onClick={handleProgressClick}
      >
        <div 
          className="progress-bar" 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      
      <div className="progress-time">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <audio 
        ref={audioRef} 
        crossOrigin="anonymous"
        onTimeUpdate={updateTime}
        onLoadedMetadata={updateTime}
        onLoadedData={() => {
          console.log('✅ Áudio carregado');
          setIsLoading(false);
        }}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={handleAudioError}
        onLoadStart={() => setIsLoading(true)}
        preload="metadata"
      >
        Seu navegador não suporta o elemento de áudio.
      </audio>
    </div>
  );
};

export default MiniPlayer;