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
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/podcast', { headers });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Não autorizado. Faça login novamente.');
        }
        throw new Error(`Erro ao carregar podcasts: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Podcasts carregados do backend:', data);
      
      // Mapeamento com valores padrão mais robustos
      const mappedPodcasts: PodcastItem[] = data.map((item: any) => {
        console.log('Processando podcast:', item); // Debug
        return {
          id: item.id?.toString() || '0',
          titulo: item.titulo || 'Título não disponível',
          descricao: item.descricao || 'Descrição não disponível',
          capaUrl: item.capaUrl || '/placeholder-podcast.png',
          audioUrl: item.audioUrl || '' // Garantir que não seja undefined
        };
      });
      
      console.log('Podcasts mapeados:', mappedPodcasts); // Debug
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