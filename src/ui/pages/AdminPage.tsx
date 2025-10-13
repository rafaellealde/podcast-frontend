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

export interface NewsItem {
  id?: number;
  titulo: string;
  descricao: string;
  imagemFile?: File;
  imagemUrl?: string;
  dataPublicacao?: string;
}

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'podcasts' | 'news'>('podcasts');
  
  // Estados para Podcasts
  const [podcasts, setPodcasts] = useState<AdminPodcastItem[]>([]);
  const [selectedPodcast, setSelectedPodcast] = useState<AdminPodcastItem | null>(null);
  const [newPodcast, setNewPodcast] = useState<AdminPodcastItem>({ titulo: '', descricao: '' });
  
  // Estados para Notícias
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [newNews, setNewNews] = useState<NewsItem>({ titulo: '', descricao: '' });
  
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Buscar podcasts do backend
  const fetchPodcasts = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/podcasts', { headers });

      if (!res.ok) {
        throw new Error(`Erro ${res.status}: ${res.statusText}`);
      }

      const text = await res.text();
      if (!text) {
        setPodcasts([]);
        return;
      }

      const data = JSON.parse(text);
      console.log('📁 Podcasts carregados:', data);
      setPodcasts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar podcasts:", error);
      setStatusMessage("Erro ao carregar podcasts");
    }
  };

  // Buscar notícias do backend
  const fetchNews = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/noticias', { headers });

      if (!res.ok) {
        throw new Error(`Erro ${res.status}: ${res.statusText}`);
      }

      const text = await res.text();
      if (!text) {
        setNews([]);
        return;
      }

      const data = JSON.parse(text);
      console.log('📰 Notícias carregadas:', data);
      
      // Mapear os dados para garantir a estrutura correta
      const mappedNews: NewsItem[] = Array.isArray(data) ? data.map((item: any) => ({
        id: item.id,
        titulo: item.titulo || 'Sem título',
        descricao: item.descricao || 'Sem descrição',
        imagemUrl: item.imagemUrl || item.capaUrl, // Backend usa capaUrl
        dataPublicacao: item.dataPublicacao
      })) : [];
      
      setNews(mappedNews);
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
      setStatusMessage("Erro ao carregar notícias");
    }
  };

  useEffect(() => {
    fetchPodcasts();
    fetchNews();
  }, []);

  // Função melhorada para tratamento de erros da API
  const handleApiError = async (response: Response, defaultMessage: string) => {
    try {
      const errorText = await response.text();
      console.error('Erro da API:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });

      if (errorText) {
        try {
          const errorData = JSON.parse(errorText);
          // Extrair mensagens de erro específicas dos campos
          if (errorData.errors && Array.isArray(errorData.errors)) {
            const fieldErrors = errorData.errors.map((err: any) => 
              `${err.fieldName}: ${err.message}`
            ).join(', ');
            return fieldErrors || errorData.message || defaultMessage;
          }
          return errorData.message || errorData.error || defaultMessage;
        } catch {
          return errorText || defaultMessage;
        }
      }
      return defaultMessage;
    } catch (error) {
      console.error('Erro ao processar resposta de erro:', error);
      return defaultMessage;
    }
  };

  // Handlers para Podcasts
  const handlePodcastInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (selectedPodcast) {
      setSelectedPodcast({ ...selectedPodcast, [name]: value });
    } else {
      setNewPodcast({ ...newPodcast, [name]: value });
    }
  };

  const handlePodcastFileChange = (e: ChangeEvent<HTMLInputElement>, field: 'capaFile' | 'audioFile') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validar tamanho do arquivo (opcional)
    if (field === 'audioFile' && file.size > 100 * 1024 * 1024) { // 100MB
      setStatusMessage('Arquivo de áudio muito grande. Máximo: 100MB');
      return;
    }
    
    if (field === 'capaFile' && file.size > 10 * 1024 * 1024) { // 10MB
      setStatusMessage('Arquivo de imagem muito grande. Máximo: 10MB');
      return;
    }

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
      const confirmed = window.confirm(`Deseja realmente excluir o podcast "${podcast.titulo}"?`);
      if (!confirmed) return;

      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Authorization': `Bearer ${token}`
      };

      const res = await fetch(`/api/podcasts/${podcast.id}`, { 
        method: 'DELETE',
        headers
      });
      
      if (!res.ok) {
        const errorMessage = await handleApiError(res, 'Erro ao excluir podcast');
        throw new Error(errorMessage);
      }

      setStatusMessage('Podcast excluído com sucesso');
      fetchPodcasts();
      setSelectedPodcast(null);
    } catch (error: any) {
      console.error(error);
      setStatusMessage(error.message || 'Erro ao excluir podcast');
    }
  };

  const handleCreateOrUpdatePodcast = async () => {
    try {
      setLoading(true);
      setStatusMessage(null);

      const target = selectedPodcast || newPodcast;
      
      // Validações
      if (!target.titulo.trim()) {
        setStatusMessage('Título é obrigatório');
        setLoading(false);
        return;
      }

      if (target.titulo.length < 3) {
        setStatusMessage('Título deve ter pelo menos 3 caracteres');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      
      let res: Response;

      if (selectedPodcast && selectedPodcast.id) {
        // ATUALIZAR podcast existente - usar JSON normal (sem arquivos)
        console.log('Atualizando podcast via JSON:', selectedPodcast.id);
        res = await fetch(`/api/podcasts/${selectedPodcast.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            titulo: target.titulo.trim(),
            descricao: (target.descricao || '').trim()
          })
        });
      } else {
        // CRIAR novo podcast - usar endpoint de upload
        if (!target.audioFile) {
          setStatusMessage('Arquivo de áudio é obrigatório para novo podcast');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        
        // Criar objeto JSON para os dados conforme esperado pelo backend
        const dadosJson = JSON.stringify({
          titulo: target.titulo.trim(),
          descricao: (target.descricao || '').trim()
        });
        
        const blob = new Blob([dadosJson], { type: 'application/json' });
        formData.append('dados', blob);
        
        if (target.audioFile) {
          formData.append('audio', target.audioFile);
        }
        
        if (target.capaFile) {
          formData.append('capa', target.capaFile);
        }

        console.log('Criando novo podcast com upload');
        res = await fetch('/api/podcasts/upload', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      console.log('Status da resposta:', res.status);
      console.log('Status text:', res.statusText);

      if (!res.ok) {
        const errorMessage = await handleApiError(res, 'Erro ao salvar podcast');
        throw new Error(errorMessage);
      }

      const responseText = await res.text();
      console.log('Resposta do servidor:', responseText);

      setStatusMessage(
        selectedPodcast ? 'Podcast atualizado com sucesso!' : 'Podcast criado com sucesso!'
      );
      setSelectedPodcast(null);
      setNewPodcast({ titulo: '', descricao: '' });
      fetchPodcasts();
    } catch (error: any) {
      console.error('Erro detalhado:', error);
      setStatusMessage(error.message || 'Erro ao salvar podcast. Verifique o console para mais detalhes.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedPodcast(null);
    setNewPodcast({ titulo: '', descricao: '' });
    setSelectedNews(null);
    setNewNews({ titulo: '', descricao: '' });
    setStatusMessage(null);
  };

  // Handlers para Notícias
  const handleNewsInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (selectedNews) {
      setSelectedNews({ ...selectedNews, [name]: value });
    } else {
      setNewNews({ ...newNews, [name]: value });
    }
  };

  const handleNewsFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validar tamanho do arquivo
    if (file.size > 10 * 1024 * 1024) { // 10MB
      setStatusMessage('Arquivo de imagem muito grande. Máximo: 10MB');
      return;
    }

    if (selectedNews) {
      setSelectedNews({ ...selectedNews, imagemFile: file });
    } else {
      setNewNews({ ...newNews, imagemFile: file });
    }
  };

  const handleSelectNews = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setNewNews({ titulo: '', descricao: '' });
    setStatusMessage(null);
  };

  const handleDeleteNews = async (newsItem: NewsItem) => {
    if (!newsItem.id) return;
    try {
      const confirmed = window.confirm(`Deseja realmente excluir a notícia "${newsItem.titulo}"?`);
      if (!confirmed) return;

      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Authorization': `Bearer ${token}`
      };

      const res = await fetch(`/api/noticias/${newsItem.id}`, { 
        method: 'DELETE',
        headers
      });
      
      if (!res.ok) {
        const errorMessage = await handleApiError(res, 'Erro ao excluir notícia');
        throw new Error(errorMessage);
      }

      setStatusMessage('Notícia excluída com sucesso');
      fetchNews();
      setSelectedNews(null);
    } catch (error: any) {
      console.error(error);
      setStatusMessage(error.message || 'Erro ao excluir notícia');
    }
  };

  const handleCreateOrUpdateNews = async () => {
    try {
      setLoading(true);
      setStatusMessage(null);

      const target = selectedNews || newNews;
      
      // Validações
      if (!target.titulo.trim() || !target.descricao.trim()) {
        setStatusMessage('Título e descrição são obrigatórios');
        setLoading(false);
        return;
      }

      if (target.titulo.length < 3) {
        setStatusMessage('Título deve ter pelo menos 3 caracteres');
        setLoading(false);
        return;
      }

      if (target.descricao.length < 10) {
        setStatusMessage('Descrição deve ter pelo menos 10 caracteres');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      
      let res: Response;

      if (selectedNews && selectedNews.id) {
        // ATUALIZAR notícia existente - usar JSON normal (sem arquivos)
        console.log('Atualizando notícia via JSON:', selectedNews.id);
        res = await fetch(`/api/noticias/${selectedNews.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            titulo: target.titulo.trim(),
            descricao: target.descricao.trim()
          })
        });
      } else {
        // CRIAR nova notícia - usar endpoint de upload se tiver imagem
        if (target.imagemFile) {
          // Usar multipart para upload com imagem
          const formData = new FormData();
          
          // Criar objeto JSON para os dados conforme esperado pelo backend
          const dadosJson = JSON.stringify({
            titulo: target.titulo.trim(),
            descricao: target.descricao.trim()
          });
          
          const blob = new Blob([dadosJson], { type: 'application/json' });
          formData.append('dados', blob);
          
          if (target.imagemFile) {
            formData.append('capa', target.imagemFile); // Backend espera 'capa'
          }

          console.log('Criando nova notícia com upload');
          res = await fetch('/api/noticias/upload', {
            method: 'POST',
            body: formData,
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        } else {
          // Usar JSON normal se não tiver imagem
          console.log('Criando nova notícia via JSON');
          res = await fetch('/api/noticias', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              titulo: target.titulo.trim(),
              descricao: target.descricao.trim()
            })
          });
        }
      }

      console.log('Status da resposta (notícia):', res.status);
      console.log('Status text (notícia):', res.statusText);

      if (!res.ok) {
        const errorMessage = await handleApiError(res, 'Erro ao salvar notícia');
        throw new Error(errorMessage);
      }

      const responseText = await res.text();
      console.log('Resposta do servidor (notícia):', responseText);

      setStatusMessage(
        selectedNews ? 'Notícia atualizada com sucesso!' : 'Notícia criada com sucesso!'
      );
      setSelectedNews(null);
      setNewNews({ titulo: '', descricao: '' });
      fetchNews();
    } catch (error: any) {
      console.error('Erro detalhado (notícia):', error);
      setStatusMessage(error.message || 'Erro ao salvar notícia. Verifique o console para mais detalhes.');
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para obter o conteúdo da notícia de forma segura
  const getNewsContent = (newsItem: NewsItem): string => {
    return newsItem.descricao || 'Sem descrição disponível';
  };

  return (
    <div className="admin-page-body">
      <h1>Painel Administrativo</h1>

      {/* Tabs de Navegação */}
      <div style={{ 
        display: 'flex', 
        marginBottom: '1.5rem',
        borderBottom: '2px solid #e5e7eb'
      }}>
        <button 
          style={{ 
            padding: '12px 24px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: activeTab === 'podcasts' ? '600' : '400',
            color: activeTab === 'podcasts' ? '#2563eb' : '#6b7280',
            borderBottom: activeTab === 'podcasts' ? '3px solid #2563eb' : '3px solid transparent',
            transition: 'all 0.2s'
          }}
          onClick={() => setActiveTab('podcasts')}
        >
          Gerenciar Podcasts
        </button>
        <button 
          style={{ 
            padding: '12px 24px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: activeTab === 'news' ? '600' : '400',
            color: activeTab === 'news' ? '#2563eb' : '#6b7280',
            borderBottom: activeTab === 'news' ? '3px solid #2563eb' : '3px solid transparent',
            transition: 'all 0.2s'
          }}
          onClick={() => setActiveTab('news')}
        >
          Gerenciar Notícias
        </button>
      </div>

      {statusMessage && (
        <div className="status-message">
          {statusMessage}
        </div>
      )}

      {activeTab === 'podcasts' && (
        <>
          <div className="podcast-form-container">
            <h2>{selectedPodcast ? 'Editar Podcast' : 'Novo Podcast'}</h2>
            
            <input
              type="text"
              name="titulo"
              placeholder="Título do podcast *"
              value={selectedPodcast?.titulo || newPodcast.titulo}
              onChange={handlePodcastInputChange}
            />
            
            <textarea
              name="descricao"
              placeholder="Descrição do podcast"
              value={selectedPodcast?.descricao || newPodcast.descricao}
              onChange={handlePodcastInputChange}
              rows={4}
            />

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                Capa (imagem):
              </label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handlePodcastFileChange(e, 'capaFile')} 
              />
              <small style={{ color: '#6b7280', fontSize: '12px' }}>
                Formatos: JPG, PNG, GIF. Máximo: 10MB {selectedPodcast && '(Apenas para novos podcasts)'}
              </small>
            </div>
            
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                Áudio *:
              </label>
              <input 
                type="file" 
                accept="audio/*" 
                onChange={(e) => handlePodcastFileChange(e, 'audioFile')} 
              />
              <small style={{ color: '#6b7280', fontSize: '12px' }}>
                Formatos: MP3, WAV, M4A. Máximo: 100MB {selectedPodcast && '(Apenas para novos podcasts)'}
              </small>
            </div>

            {selectedPodcast && (
              <div style={{ 
                backgroundColor: '#fef3c7', 
                padding: '0.75rem', 
                borderRadius: '4px',
                marginBottom: '1rem'
              }}>
                <p style={{ margin: 0, color: '#92400e', fontSize: '14px' }}>
                  <strong>Atenção:</strong> A edição de podcasts não suporta alteração de arquivos (áudio e capa). 
                  Para alterar arquivos, exclua e crie um novo podcast.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                onClick={handleCreateOrUpdatePodcast} 
                disabled={loading}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  transition: 'background-color 0.2s',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Processando...' : selectedPodcast ? 'Atualizar Podcast' : 'Criar Podcast'}
              </button>
              
              {(selectedPodcast || newPodcast.titulo || newPodcast.descricao) && (
                <button 
                  onClick={handleCancelEdit}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'background-color 0.2s'
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>

          <div className="podcast-list-container">
            <h2>Podcasts Existentes ({podcasts.length})</h2>
            
            {podcasts.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>
                Nenhum podcast cadastrado.
              </p>
            ) : (
              <ul>
                {podcasts.map((podcast) => (
                  <li 
                    key={podcast.id} 
                    className={selectedPodcast?.id === podcast.id ? 'selected' : ''}
                  >
                    <div 
                      className="podcast-item-info" 
                      onClick={() => handleSelectPodcast(podcast)}
                    >
                      <strong>{podcast.titulo}</strong>
                      <p style={{ margin: '0.25rem 0', color: '#6b7280', fontSize: '14px' }}>
                        {podcast.descricao}
                      </p>
                      {podcast.capaUrl && (
                        <small style={{ color: '#9ca3af', fontSize: '12px' }}>
                          Capa: {podcast.capaUrl}
                        </small>
                      )}
                      {podcast.audioUrl && (
                        <small style={{ color: '#9ca3af', fontSize: '12px', display: 'block' }}>
                          Áudio: {podcast.audioUrl}
                        </small>
                      )}
                    </div>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDeletePodcast(podcast)}
                    >
                      Excluir
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {activeTab === 'news' && (
        <>
          <div className="podcast-form-container">
            <h2>{selectedNews ? 'Editar Notícia' : 'Nova Notícia'}</h2>
            
            <input
              type="text"
              name="titulo"
              placeholder="Título da notícia *"
              value={selectedNews?.titulo || newNews.titulo}
              onChange={handleNewsInputChange}
            />
            
            <textarea
              name="descricao"
              placeholder="Descrição da notícia *"
              value={selectedNews?.descricao || newNews.descricao}
              onChange={handleNewsInputChange}
              rows={6}
            />

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                Imagem:
              </label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleNewsFileChange} 
              />
              <small style={{ color: '#6b7280', fontSize: '12px' }}>
                Formatos: JPG, PNG, GIF. Máximo: 10MB {selectedNews && '(Apenas para novas notícias)'}
              </small>
            </div>

            {selectedNews && (
              <div style={{ 
                backgroundColor: '#fef3c7', 
                padding: '0.75rem', 
                borderRadius: '4px',
                marginBottom: '1rem'
              }}>
                <p style={{ margin: 0, color: '#92400e', fontSize: '14px' }}>
                  <strong>Atenção:</strong> A edição de notícias não suporta alteração de imagem. 
                  Para alterar a imagem, exclua e crie uma nova notícia.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                onClick={handleCreateOrUpdateNews} 
                disabled={loading}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  transition: 'background-color 0.2s',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Processando...' : selectedNews ? 'Atualizar Notícia' : 'Criar Notícia'}
              </button>
              
              {(selectedNews || newNews.titulo || newNews.descricao) && (
                <button 
                  onClick={handleCancelEdit}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'background-color 0.2s'
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>

          <div className="podcast-list-container">
            <h2>Notícias Existentes ({news.length})</h2>
            
            {news.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>
                Nenhuma notícia cadastrada.
              </p>
            ) : (
              <ul>
                {news.map((newsItem) => (
                  <li 
                    key={newsItem.id} 
                    className={selectedNews?.id === newsItem.id ? 'selected' : ''}
                  >
                    <div 
                      className="podcast-item-info" 
                      onClick={() => handleSelectNews(newsItem)}
                    >
                      <strong>{newsItem.titulo || 'Sem título'}</strong>
                      <p style={{ margin: '0.25rem 0', color: '#6b7280', fontSize: '14px' }}>
                        {getNewsContent(newsItem).length > 100 
                          ? `${getNewsContent(newsItem).substring(0, 100)}...` 
                          : getNewsContent(newsItem)}
                      </p>
                      {newsItem.imagemUrl && newsItem.imagemUrl !== 'null' && (
                        <small style={{ color: '#9ca3af', fontSize: '12px' }}>
                          Imagem: {newsItem.imagemUrl}
                        </small>
                      )}
                      {newsItem.dataPublicacao && (
                        <small style={{ color: '#9ca3af', fontSize: '12px', display: 'block' }}>
                          Publicada em: {new Date(newsItem.dataPublicacao).toLocaleDateString()}
                        </small>
                      )}
                    </div>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDeleteNews(newsItem)}
                    >
                      Excluir
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPage;