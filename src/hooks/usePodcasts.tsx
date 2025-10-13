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
      
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/podcasts', { headers });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Não autorizado. Faça login novamente.');
        }
        throw new Error(`Erro ao carregar podcasts: ${response.status}`);
      }
      
      const data: PodcastApiResponse[] = await response.json();
      console.log('Podcasts carregados do backend:', data);
      
      // Mapeamento robusto com tratamento de audioUrl
      const mappedPodcasts: PodcastItem[] = data.map((item: PodcastApiResponse) => {
        console.log('Processando podcast:', item);
        
        return {
          id: item.id?.toString() || Math.random().toString(),
          titulo: item.titulo?.trim() || 'Título não disponível',
          descricao: item.descricao?.trim() || 'Descrição não disponível',
          capaUrl: item.capaUrl?.trim() || '/placeholder-podcast.png',
          audioUrl: item.audioUrl?.trim() || '' // Garantir que sempre seja string
        };
      });
      
      console.log('Podcasts mapeados:', mappedPodcasts);
      setPodcasts(mappedPodcasts);
    } catch (err) {
      console.error('Erro ao buscar podcasts:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  return { podcasts, loading, error, refetch: fetchPodcasts };
};