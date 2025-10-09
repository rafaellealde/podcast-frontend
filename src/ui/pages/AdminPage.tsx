import React, { useState, useEffect, ChangeEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './AdminPage.css';

export interface AdminPodcastItem {
  id?: number;
  titulo: string;
  descricao: string;
  capaFile?: File;
  audioFile?: File;
  capaUrl?: string;
  audioUrl?: string;
}

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [podcasts, setPodcasts] = useState<AdminPodcastItem[]>([]);
  const [selectedPodcast, setSelectedPodcast] = useState<AdminPodcastItem | null>(null);
  const [newPodcast, setNewPodcast] = useState<AdminPodcastItem>({ titulo: '', descricao: '' });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Buscar podcasts do backend
  const fetchPodcasts = async () => {
    try {
      const res = await fetch('/api/podcasts');
      const data = await res.json();
      setPodcasts(data);
    } catch (error) {
      console.error('Erro ao buscar podcasts:', error);
      setStatusMessage('Erro ao carregar podcasts');
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (selectedPodcast) {
      setSelectedPodcast({ ...selectedPodcast, [name]: value });
    } else {
      setNewPodcast({ ...newPodcast, [name]: value });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: 'capaFile' | 'audioFile') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (selectedPodcast) {
      setSelectedPodcast({ ...selectedPodcast, [field]: file });
    } else {
      setNewPodcast({ ...newPodcast, [field]: file });
    }
  };

  const handleSelectPodcast = (podcast: AdminPodcastItem) => {
    setSelectedPodcast(podcast);
    setNewPodcast({ titulo: '', descricao: '' });
    setStatusMessage(null);
  };

  const handleDeletePodcast = async (podcast: AdminPodcastItem) => {
    if (!podcast.id) return;
    try {
      const confirmed = window.confirm(`Deseja realmente excluir "${podcast.titulo}"?`);
      if (!confirmed) return;

      const res = await fetch(`/api/podcasts/${podcast.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao excluir podcast');

      setStatusMessage('Podcast excluído com sucesso');
      fetchPodcasts();
      setSelectedPodcast(null);
    } catch (error: any) {
      console.error(error);
      setStatusMessage(error.message || 'Erro ao excluir podcast');
    }
  };

  const handleCreateOrUpdate = async () => {
    try {
      setLoading(true);
      setStatusMessage(null);

      const target = selectedPodcast || newPodcast;
      if (!target.titulo) {
        setStatusMessage('Título é obrigatório');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('titulo', target.titulo || '');
      formData.append('descricao', target.descricao || '');
      if (target.capaFile) formData.append('capa', target.capaFile);
      if (target.audioFile) formData.append('audio', target.audioFile);

      const url = selectedPodcast ? `/api/podcasts/${selectedPodcast.id}` : '/api/podcasts';
      const method = selectedPodcast ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) {
        const errData = await res.json();
        setStatusMessage(errData.message || 'Erro ao salvar podcast');
        setLoading(false);
        return;
      }

      setStatusMessage(selectedPodcast ? 'Podcast atualizado com sucesso!' : 'Podcast criado com sucesso!');
      setSelectedPodcast(null);
      setNewPodcast({ titulo: '', descricao: '' });
      fetchPodcasts();
    } catch (error: any) {
      console.error(error);
      setStatusMessage(error.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-body">
      <h1>Administração de Podcasts</h1>

      {statusMessage && <div className="status-message">{statusMessage}</div>}

      <div className="podcast-form-container">
        <h2>{selectedPodcast ? 'Editar Podcast' : 'Novo Podcast'}</h2>
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={selectedPodcast?.titulo || newPodcast.titulo}
          onChange={handleInputChange}
        />
        <textarea
          name="descricao"
          placeholder="Descrição"
          value={selectedPodcast?.descricao || newPodcast.descricao}
          onChange={handleInputChange}
        />

        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'capaFile')} />
        <input type="file" accept="audio/*" onChange={(e) => handleFileChange(e, 'audioFile')} />

        <button onClick={handleCreateOrUpdate} disabled={loading}>
          {loading ? 'Processando...' : selectedPodcast ? 'Atualizar Podcast' : 'Criar Podcast'}
        </button>
      </div>

      <div className="podcast-list-container">
        <h2>Podcasts existentes</h2>
        {podcasts.length === 0 && <p>Nenhum podcast cadastrado ainda.</p>}
        <ul>
          {podcasts.map((podcast) => (
            <li key={podcast.id} className={selectedPodcast?.id === podcast.id ? 'selected' : ''}>
              <div className="podcast-item-info" onClick={() => handleSelectPodcast(podcast)}>
                <strong>{podcast.titulo}</strong> - {podcast.descricao}
              </div>
              <button className="delete-btn" onClick={() => handleDeletePodcast(podcast)}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;