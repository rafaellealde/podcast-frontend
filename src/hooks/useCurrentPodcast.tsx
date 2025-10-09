import React, { createContext, useContext, useState, useEffect } from 'react';

export interface PodcastItem {
  id: string;
  titulo: string;
  descricao: string;
  capaUrl: string;
  audioUrl: string | null;
}

interface CurrentPodcastContextType {
  currentPodcast: PodcastItem | null;
  setCurrentPodcast: (podcast: PodcastItem | null) => void;
}

const CurrentPodcastContext = createContext<CurrentPodcastContextType | undefined>(undefined);

export const useCurrentPodcast = () => {
  const context = useContext(CurrentPodcastContext);
  if (!context) {
    throw new Error('useCurrentPodcast must be used within a CurrentPodcastProvider');
  }
  return context;
};

interface CurrentPodcastProviderProps {
  children: React.ReactNode;
}

export const CurrentPodcastProvider = ({ children }: CurrentPodcastProviderProps) => {
  const [currentPodcast, setCurrentPodcastState] = useState<PodcastItem | null>(null);

  // Carregar do localStorage ao inicializar
  useEffect(() => {
    const savedPodcast = localStorage.getItem('currentPodcast');
    if (savedPodcast) {
      try {
        const podcast = JSON.parse(savedPodcast);
        setCurrentPodcastState(podcast);
        console.log('📁 Podcast carregado do localStorage:', podcast.titulo);
      } catch (error) {
        console.error('❌ Erro ao carregar podcast do localStorage:', error);
      }
    }
  }, []);

  // Função para definir o podcast (salva no localStorage também)
  const setCurrentPodcast = (podcast: PodcastItem | null) => {
    setCurrentPodcastState(podcast);
    if (podcast) {
      localStorage.setItem('currentPodcast', JSON.stringify(podcast));
      console.log('💾 Podcast salvo no localStorage:', podcast.titulo);
    } else {
      localStorage.removeItem('currentPodcast');
      console.log('🗑️ Podcast removido do localStorage');
    }
  };

  const value: CurrentPodcastContextType = {
    currentPodcast,
    setCurrentPodcast,
  };

  return (
    <CurrentPodcastContext.Provider value={value}>
      {children}
    </CurrentPodcastContext.Provider>
  );
};