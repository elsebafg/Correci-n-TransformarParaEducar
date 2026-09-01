import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Image, Clock, ChevronRight } from 'lucide-react';

export default function NewsDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    // Fetch the specific news article
    fetch(`/api/news/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Noticia no encontrada');
        }
        return res.json();
      })
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });

    // Fetch recent news for the sidebar
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        // Filter out current post and take top 3
        const filtered = data.filter(item => item.id.toString() !== id).slice(0, 3);
        setRecentPosts(filtered);
      })
      .catch(err => console.error('Error fetching recent news:', err));

  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          width: '50px',
          height: '50px',
          border: '4px solid rgba(10, 37, 64, 0.1)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }} />
        <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Cargando noticia...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px', color: 'var(--color-accent-red)' }}>¡Ups! La noticia no existe</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
          La noticia que buscas no pudo ser encontrada o ha sido eliminada.
        </p>
        <Link to="/noticias" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={18} /> Volver a Noticias
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--color-bg-light)', paddingBottom: '80px' }}>
      {/* Cabecera / Breadcrumb */}
      <div style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '40px 0' }}>
        <div className="container">
          <Link to="/noticias" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px', fontWeight: '500' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
            <ArrowLeft size={16} /> Volver a Noticias
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span className="badge badge-orange" style={{ padding: '6px 14px' }}>{post.tag}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
              <Calendar size={16} /> {post.date}
            </span>
          </div>
          <h1 style={{ color: 'white', fontSize: '2.5rem', marginTop: '16px', lineHeight: '1.2' }}>{post.title}</h1>
        </div>
      </div>

      <div className="container" style={{ marginTop: '40px' }}>
        {/* Layout de dos columnas: Detalle a la izquierda, barra lateral a la derecha */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '40px' }} className="news-detail-layout">
          
          {/* Contenido Principal */}
          <div>
            <div className="card" style={{ boxShadow: 'var(--shadow-md)', border: 'none' }}>
              {post.imagen ? (
                <img
                  src={`${post.imagen}`}
                  alt={post.title}
                  style={{ width: '100%', maxHeight: '450px', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ height: '240px', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image size={64} color="#94A3B8" />
                </div>
              )}
              
              <div className="card-body" style={{ padding: '40px' }}>
                {/* Cuerpo de la noticia */}
                <div style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'var(--color-text-main)', whiteSpace: 'pre-wrap' }}>
                  {post.contenido || post.summary}
                </div>
              </div>
            </div>
          </div>

          {/* Barra Lateral / Sidebar */}
          <div>
            <div style={{ position: 'sticky', top: '100px' }}>
              <h3 style={{ marginBottom: '20px', borderBottom: '2px solid var(--color-primary)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={20} color="var(--color-accent-orange)" />
                Otras Novedades
              </h3>

              {recentPosts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {recentPosts.map(item => (
                    <Link to={`/noticias/${item.id}`} key={item.id} className="card" style={{ display: 'block', textDecoration: 'none', transition: 'all 0.2s' }}>
                      <div style={{ display: 'flex', gap: '12px', padding: '12px' }}>
                        {item.imagen ? (
                          <img
                            src={`${item.imagen}`}
                            alt={item.title}
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                          />
                        ) : (
                          <div style={{ width: '80px', height: '80px', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)' }}>
                            <Image size={24} color="#94A3B8" />
                          </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-orange)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            {item.tag}
                          </span>
                          <h4 style={{ fontSize: '0.95rem', margin: '4px 0 2px 0', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.3' }}>
                            {item.title}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.date}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No hay otras noticias recientes.</p>
              )}

              {/* Botón de volver al listado general */}
              <div style={{ marginTop: '30px' }}>
                <Link to="/noticias" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <ArrowLeft size={16} /> Ver todas las noticias
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .news-detail-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
