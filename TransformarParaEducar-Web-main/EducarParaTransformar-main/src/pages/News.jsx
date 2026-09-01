import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trash2, Edit, Image } from 'lucide-react';

export default function News() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', summary: '', contenido: '', tag: 'General' });
  const [selectedTag, setSelectedTag] = useState('Todos');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // States for Edit Modal
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', summary: '', contenido: '', tag: 'General' });
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const editFileInputRef = useRef(null);

  const tagList = ['Todos', 'General', 'Primaria', 'Secundaria', 'Deportes', 'Eventos', 'Institucional'];

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.summary || !newPost.contenido) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('summary', newPost.summary);
    formData.append('contenido', newPost.contenido);
    formData.append('tag', newPost.tag || 'General');
    formData.append('date', new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }));
    if (selectedFile) {
      formData.append('imagen', selectedFile);
    }

    fetch('/api/news', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(savedPost => {
      setItems([savedPost, ...items]);
      setNewPost({ title: '', summary: '', contenido: '', tag: 'General' });
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    })
    .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta noticia?')) {
      fetch(`/api/news/${id}`, { method: 'DELETE' })
        .then(() => setItems(items.filter(item => item.id !== id)));
    }
  };

  // Edit Handlers
  const handleEditStart = (item) => {
    setEditingPost(item);
    setEditForm({
      title: item.title,
      summary: item.summary,
      contenido: item.contenido || '',
      tag: item.tag || 'General'
    });
    setEditFile(null);
    setEditPreview(item.imagen ? `${item.imagen}` : null);
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFile(file);
      setEditPreview(URL.createObjectURL(file));
    }
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    if (!editForm.title || !editForm.summary || !editForm.contenido) return;

    setEditLoading(true);

    const formData = new FormData();
    formData.append('title', editForm.title);
    formData.append('summary', editForm.summary);
    formData.append('contenido', editForm.contenido);
    formData.append('tag', editForm.tag || 'General');
    if (editFile) {
      formData.append('imagen', editFile);
    }

    fetch(`/api/news/${editingPost.id}`, {
      method: 'PUT',
      body: formData
    })
    .then(res => {
      if (!res.ok) throw new Error('Error al guardar los cambios');
      return res.json();
    })
    .then(updatedPost => {
      setItems(items.map(item => item.id === updatedPost.id ? updatedPost : item));
      setEditingPost(null);
      setEditFile(null);
      setEditPreview(null);
    })
    .catch(err => console.error(err))
    .finally(() => setEditLoading(false));
  };

  const canCreate = user && (user.role === 'autoridad' || user.role === 'docente');

  return (
    <div className="animate-fade-in">
      <section className="section" style={{ backgroundColor: 'var(--color-bg-white)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
            <h1 className="section-title" style={{ marginBottom: 0 }}>Noticias y Novedades</h1>
          </div>

          {canCreate && (
            <div className="card" style={{ marginBottom: '48px', backgroundColor: '#F8FAFC' }}>
              <div className="card-body">
                <h3>Publicar Nueva Noticia</h3>
                <form onSubmit={handleCreate} style={{ marginTop: '16px' }}>
                  <div className="grid-2" style={{ gap: '16px', marginBottom: '16px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Título</label>
                      <input required type="text" className="form-input" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Tema / Categoría</label>
                      <select className="form-select" value={newPost.tag} onChange={e => setNewPost({...newPost, tag: e.target.value})}>
                        <option value="General">General</option>
                        <option value="Primaria">Primaria</option>
                        <option value="Secundaria">Secundaria</option>
                        <option value="Deportes">Deportes</option>
                        <option value="Eventos">Eventos</option>
                        <option value="Institucional">Institucional</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Resumen de la Noticia (Texto corto para la tarjeta)</label>
                    <textarea required className="form-textarea" rows="2" placeholder="Escribe un breve resumen de la noticia..." value={newPost.summary} onChange={e => setNewPost({...newPost, summary: e.target.value})}></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contenido Completo de la Noticia</label>
                    <textarea required className="form-textarea" rows="6" placeholder="Escribe el desarrollo completo de la noticia aquí..." value={newPost.contenido} onChange={e => setNewPost({...newPost, contenido: e.target.value})}></textarea>
                  </div>

                  {/* Input de imagen */}
                  <div className="form-group">
                    <label className="form-label">Imagen (opcional)</label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: '2px dashed #CBD5E1',
                        borderRadius: '8px',
                        padding: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        backgroundColor: '#fff',
                        transition: 'border-color 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#CBD5E1'}
                    >
                      {preview ? (
                        <img src={preview} alt="preview" style={{ height: '60px', width: '90px', objectFit: 'cover', borderRadius: '6px' }} />
                      ) : (
                        <Image size={28} color="#94A3B8" />
                      )}
                      <span style={{ color: '#64748B', fontSize: '0.9rem' }}>
                        {selectedFile ? selectedFile.name : 'Hacer clic para seleccionar una imagen'}
                      </span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Publicando...' : 'Publicar'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Barra de Filtros por Tema */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '40px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            backgroundColor: '#F1F5F9',
            padding: '16px 24px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {tagList.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                style={{
                  padding: '8px 20px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  borderRadius: 'var(--radius-full)',
                  border: selectedTag === tag ? 'none' : '1px solid #CBD5E1',
                  backgroundColor: selectedTag === tag ? 'var(--color-primary)' : 'white',
                  color: selectedTag === tag ? 'white' : 'var(--color-text-main)',
                  cursor: 'pointer',
                  boxShadow: selectedTag === tag ? 'var(--shadow-md)' : 'none',
                  transition: 'all 0.2s ease-in-out',
                }}
                onMouseEnter={e => {
                  if (selectedTag !== tag) {
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }
                }}
                onMouseLeave={e => {
                  if (selectedTag !== tag) {
                    e.currentTarget.style.borderColor = '#CBD5E1';
                    e.currentTarget.style.color = 'var(--color-text-main)';
                  }
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="grid-3">
            {items.filter(item => selectedTag === 'Todos' || item.tag === selectedTag).length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
                <h3 style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>No hay noticias</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>No se encontraron novedades publicadas bajo el tema "{selectedTag}".</p>
              </div>
            ) : (
              items
                .filter(item => selectedTag === 'Todos' || item.tag === selectedTag)
                .map(item => (
                  <div key={item.id} className="card">
                    <Link to={`/noticias/${item.id}`} style={{ display: 'block' }}>
                      {item.imagen ? (
                        <img
                          src={`${item.imagen}`}
                          alt={item.title}
                          style={{ height: '180px', width: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ height: '180px', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Image size={36} color="#94A3B8" />
                        </div>
                      )}
                    </Link>
                    <div className="card-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-accent-orange)', fontWeight: 'bold' }}>{item.tag} • {item.date}</span>
                        {canCreate && (
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button onClick={() => handleEditStart(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }} title="Editar noticia">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent-red)' }} title="Eliminar noticia">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                      <Link to={`/noticias/${item.id}`}>
                        <h3 style={{ margin: '12px 0', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent-orange)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-primary)'}>{item.title}</h3>
                      </Link>
                      <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>{item.summary}</p>
                      <Link to={`/noticias/${item.id}`} style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Leer más →</Link>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </section>

      {/* Modal de Edición de Noticia */}
      {editingPost && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(10, 37, 64, 0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="card animate-fade-in" style={{
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
            border: 'none',
            backgroundColor: '#fff'
          }}>
            <div className="card-body" style={{ padding: '32px' }}>
              <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit size={24} color="var(--color-accent-orange)" />
                Editar Noticia
              </h2>
              
              <form onSubmit={handleEditSave}>
                <div className="grid-2" style={{ gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Título</label>
                    <input
                      required
                      type="text"
                      className="form-input"
                      value={editForm.title}
                      onChange={e => setEditForm({...editForm, title: e.target.value})}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Tema / Categoría</label>
                    <select
                      className="form-select"
                      value={editForm.tag}
                      onChange={e => setEditForm({...editForm, tag: e.target.value})}
                    >
                      <option value="General">General</option>
                      <option value="Primaria">Primaria</option>
                      <option value="Secundaria">Secundaria</option>
                      <option value="Deportes">Deportes</option>
                      <option value="Eventos">Eventos</option>
                      <option value="Institucional">Institucional</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Resumen de la Noticia (Texto corto para la tarjeta)</label>
                  <textarea
                    required
                    className="form-textarea"
                    rows="2"
                    value={editForm.summary}
                    onChange={e => setEditForm({...editForm, summary: e.target.value})}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Contenido Completo de la Noticia</label>
                  <textarea
                    required
                    className="form-textarea"
                    rows="6"
                    value={editForm.contenido}
                    onChange={e => setEditForm({...editForm, contenido: e.target.value})}
                  ></textarea>
                </div>

                {/* Input de imagen */}
                <div className="form-group">
                  <label className="form-label">Imagen de la Noticia</label>
                  <div
                    onClick={() => editFileInputRef.current?.click()}
                    style={{
                      border: '2px dashed #CBD5E1',
                      borderRadius: '8px',
                      padding: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      backgroundColor: '#F8FAFC',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#CBD5E1'}
                  >
                    {editPreview ? (
                      <img src={editPreview} alt="preview" style={{ height: '70px', width: '105px', objectFit: 'cover', borderRadius: '6px', boxShadow: 'var(--shadow-sm)' }} />
                    ) : (
                      <Image size={32} color="#94A3B8" />
                    )}
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ display: 'block', color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                        {editFile ? editFile.name : 'Cambiar Imagen'}
                      </span>
                      <span style={{ display: 'block', color: '#64748B', fontSize: '0.8rem', marginTop: '2px' }}>
                        Haga clic para seleccionar una nueva foto
                      </span>
                    </div>
                  </div>
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleEditFileChange}
                    style={{ display: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px' }}>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setEditingPost(null)}
                    style={{ backgroundColor: '#E2E8F0', color: 'var(--color-text-main)' }}
                    disabled={editLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={editLoading}
                  >
                    {editLoading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
