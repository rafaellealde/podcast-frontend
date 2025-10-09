import { useState, useEffect } from 'react';

export interface PodcastItem {
  id: string;
  titulo: string;
  descricao: string;
  capaUrl: string;
  audioUrl: string;
}

export const usePodcasts = () => {
  const [podcasts, setPodcasts] = useState<PodcastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/podcasts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Não autorizado. Faça login novamente.');
        }
        throw new Error(`Erro ao carregar podcasts: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Podcasts carregados:', data);
      
      // Mapear os dados do backend para o formato do frontend
      const mappedPodcasts: PodcastItem[] = data.map((item: any) => ({
        id: item.id.toString(),
        titulo: item.titulo,
        descricao: item.descricao,
        capaUrl: item.capaUrl || '/placeholder-podcast.png',
        audioUrl: item.audioUrl
      }));
      
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