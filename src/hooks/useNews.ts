import { useState, useEffect } from 'react';

export interface NewsItem {
  id: string;
  titulo: string;
  descricao: string;
  capaUrl: string;
}

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/noticias');
      
      if (!response.ok) {
        throw new Error(`Erro ao carregar notícias: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Notícias carregadas:', data);
      
      // Mapear os dados do backend para o formato do frontend
      const mappedNews: NewsItem[] = data.map((item: any) => ({
        id: item.id.toString(),
        titulo: item.titulo,
        descricao: item.descricao,
        capaUrl: item.capaUrl || '/placeholder-news.png'
      }));
      
      setNews(mappedNews);
    } catch (err) {
      console.error('Erro ao buscar notícias:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return { news, loading, error, refetch: fetchNews };
};