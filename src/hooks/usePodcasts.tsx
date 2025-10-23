import { useState, useEffect } from 'react';
import type { PodcastItem, PodcastApiResponse } from '../models/podcast';

export const usePodcasts = () => {
  const [podcasts, setPodcasts] = useState<PodcastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // NÃO enviar token - podcasts devem ser públicos
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      // Removemos a autenticação para podcasts públicos
      // const token = localStorage.getItem('token');
      // if (token) {
      //   headers['Authorization'] = `Bearer ${token}`;
      // }

      const response = await fetch('/api/podcasts', { headers });
      
      if (!response.ok) {
        // Se der erro mesmo sem token, tentar sem headers também
        if (response.status >= 400) {
          console.warn('Erro com headers, tentando sem headers...');
          const responseWithoutHeaders = await fetch('/api/podcasts');
          if (!responseWithoutHeaders.ok) {
            throw new Error(`Erro ao carregar podcasts: ${responseWithoutHeaders.status}`);
          }
          const data = await responseWithoutHeaders.json();
          return processPodcastsData(data);
        }
        throw new Error(`Erro ao carregar podcasts: ${response.status}`);
      }
      
      const data: PodcastApiResponse[] = await response.json();
      processPodcastsData(data);
      
    } catch (err) {
      console.error('Erro ao buscar podcasts:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para processar os dados dos podcasts
  const processPodcastsData = (data: any) => {
    console.log('Podcasts carregados do backend:', data);
    
    // Mapeamento robusto com tratamento de audioUrl
    const mappedPodcasts: PodcastItem[] = Array.isArray(data) ? data.map((item: PodcastApiResponse) => {
      console.log('Processando podcast:', item);
      
      return {
        id: item.id?.toString() || Math.random().toString(),
        titulo: item.titulo?.trim() || 'Título não disponível',
        descricao: item.descricao?.trim() || 'Descrição não disponível',
        capaUrl: item.capaUrl?.trim() || '/placeholder-podcast.png',
        audioUrl: item.audioUrl?.trim() || '' // Garantir que sempre seja string
      };
    }) : [];
    
    console.log('Podcasts mapeados:', mappedPodcasts);
    setPodcasts(mappedPodcasts);
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  return { podcasts, loading, error, refetch: fetchPodcasts };
};