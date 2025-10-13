export interface PodcastItem {
  id: string;
  titulo: string;
  descricao: string;
  capaUrl: string;
  audioUrl: string; // Sempre string, usar string vazia se não houver áudio
}

export interface PodcastApiResponse {
  id: number;
  titulo: string;
  descricao: string;
  capaUrl: string;
  audioUrl: string | null; // Pode ser null da API
}