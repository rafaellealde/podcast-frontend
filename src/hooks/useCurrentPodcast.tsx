import React, { createContext, useContext, useState, useEffect } from 'react';
import type { PodcastItem } from '../models/podcast'; // Use o tipo compartilhado

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
        
        // Validar e normalizar o podcast do localStorage
        const validatedPodcast: PodcastItem = {
          id: podcast.id || Math.random().toString(),
          titulo: podcast.titulo || 'Título não disponível',
          descricao: podcast.descricao || 'Descrição não disponível',
          capaUrl: podcast.capaUrl || '/placeholder-podcast.png',
          audioUrl: podcast.audioUrl || '' // Garantir que seja string
        };
        
        setCurrentPodcastState(validatedPodcast);
        console.log('📁 Podcast carregado do localStorage:', validatedPodcast.titulo);
      } catch (error) {
        console.error('❌ Erro ao carregar podcast do localStorage:', error);
        localStorage.removeItem('currentPodcast');
      }
    }
  }, []);

  // Função para definir o podcast (salva no localStorage também)
  const setCurrentPodcast = (podcast: PodcastItem | null) => {
    if (podcast) {
      // Validar o podcast antes de salvar
      const validatedPodcast: PodcastItem = {
        id: podcast.id || Math.random().toString(),
        titulo: podcast.titulo || 'Título não disponível',
        descricao: podcast.descricao || 'Descrição não disponível',
        capaUrl: podcast.capaUrl || '/placeholder-podcast.png',
        audioUrl: podcast.audioUrl || '' // Garantir que seja string
      };
      
      setCurrentPodcastState(validatedPodcast);
      localStorage.setItem('currentPodcast', JSON.stringify(validatedPodcast));
      console.log('💾 Podcast salvo no localStorage:', validatedPodcast.titulo);
    } else {
      setCurrentPodcastState(null);
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