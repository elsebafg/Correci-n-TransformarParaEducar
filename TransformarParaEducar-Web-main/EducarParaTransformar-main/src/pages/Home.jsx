import { ArrowRight, Star, Heart, BookOpen, Image, Clock, MapPin, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reviews from '../components/Reviews';

export default function Home() {
  const [noticias, setNoticias] = useState([]); //Se crea el estado (useState) para las noticias 
  const [eventos, setEventos] = useState([]); // Estado para los eventos escolares
  const [activeEvent, setActiveEvent] = useState(null); // Estado para el modal del evento activo

  useEffect(() => { //Se cargan las noticias desde el servidor
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setNoticias(data))
      .catch(err => console.error('Error al traer noticias:', err));
  }, []);

  useEffect(() => { // Se cargan los eventos desde el servidor
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEventos(data))
      .catch(err => console.error('Error al traer eventos:', err));
  }, []);

  const getTagStyles = (tag) => {
    switch (tag?.toLowerCase()) {
      case 'institucional':
        return { color: '#2563EB', backgroundColor: 'rgba(59, 130, 246, 0.1)' };
      case 'deportes':
        return { color: '#16A34A', backgroundColor: 'rgba(22, 163, 74, 0.1)' };
      case 'familias':
        return { color: '#DB2777', backgroundColor: 'rgba(219, 39, 119, 0.1)' };
      default:
        return { color: '#475569', backgroundColor: 'rgba(71, 85, 105, 0.1)' };
    }
  };
  return (
    <div>
      {/* Hero Section */}
      <section className="hero" style={{
        backgroundImage: 'linear-gradient(rgba(10, 37, 64, 0.8), rgba(10, 37, 64, 0.9)), url("/fondo.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        padding: '120px 0',
        textAlign: 'center'
      }}>
        <div className="container animate-fade-in">
          <span className="badge badge-orange" style={{ marginBottom: '24px' }}>Admisiones Abiertas</span>
          <h1 style={{ color: 'white', fontSize: '4rem', marginBottom: '24px', maxWidth: '800px', margin: '0 auto 24px' }}>
            Inspiramos, desafiamos y empoderamos
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px', color: 'rgba(255,255,255,0.8)' }}>
            Formando a los líderes del mañana con excelencia académica, valores humanos y una visión global.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/inscripcion" className="btn btn-accent" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Inscribite Hoy <ArrowRight size={18} />
            </Link>
            <Link to="/quienes-somos" className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              Conócenos
            </Link>
          </div>
        </div>
      </section>

      {/* Sección de noticias */}
      <section className="section bg-light">
        <div className="container">
          <h2 className="section-title">Últimas Noticias</h2>
          <div className="grid-3">
            {noticias.slice(0, 3).map((item) => (
              <div key={item.id} className="card">
                {/* Imagen de la noticia o un placeholder si no tiene */}
                <Link to={`/noticias/${item.id}`} style={{ display: 'block' }}>
                  {item.imagen ? (
                    <img
                      src={`${item.imagen}`}
                      alt={item.title}
                      style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ height: '200px', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Image size={36} color="#94A3B8" />
                    </div>
                  )}
                </Link>

                <div className="card-body">
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-accent-orange)', fontWeight: 'bold' }}>
                    {item.tag} • {item.date}
                  </span>
                  <Link to={`/noticias/${item.id}`}>
                    <h3 style={{ margin: '8px 0', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent-orange)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-primary)'}>
                      {item.title}
                    </h3>
                  </Link>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>{item.summary}</p>
                  <Link to={`/noticias/${item.id}`} style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                    Leer más →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Próximos Eventos */}
      <section className="section" style={{ backgroundColor: 'white' }}>
        <div className="container animate-fade-in">
          <h2 className="section-title">Próximos Eventos</h2>
          
          {eventos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-muted)', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-lg)' }}>
              No hay eventos escolares programados próximamente.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginTop: '32px'
            }}>
              {eventos.map(event => (
                <div key={event.id} className="card" style={{
                  display: 'flex',
                  flexDirection: 'row',
                  padding: '20px',
                  gap: '20px',
                  alignItems: 'center',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#F1F5F9',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveEvent(event)}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}>
                  {/* Calendario miniatura */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '70px',
                    height: '75px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-sm)',
                    flexShrink: 0
                  }}>
                    <div style={{
                      backgroundColor: 'var(--color-accent-orange)',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      padding: '4px 0',
                      textTransform: 'uppercase'
                    }}>
                      {event.mes}
                    </div>
                    <div style={{
                      backgroundColor: '#FFFFFF',
                      color: 'var(--color-primary)',
                      fontSize: '1.6rem',
                      fontWeight: '800',
                      lineHeight: '1.2',
                      padding: '4px 0'
                    }}>
                      {event.dia}
                    </div>
                  </div>

                  {/* Info de evento */}
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                    <span className="badge" style={{
                      alignSelf: 'flex-start',
                      fontSize: '0.7rem',
                      padding: '2px 8px',
                      marginBottom: '8px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 'bold',
                      ...getTagStyles(event.tag)
                    }}>
                      {event.tag}
                    </span>
                    <h4 style={{
                      fontSize: '1.05rem',
                      color: 'var(--color-primary)',
                      marginBottom: '6px',
                      fontWeight: '700',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {event.titulo}
                    </h4>
                    <div style={{
                      fontSize: '0.85rem',
                      color: 'var(--color-text-muted)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} color="#64748B" /> {event.hora}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <MapPin size={14} color="#64748B" /> {event.lugar}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Valores */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className="grid-3" style={{ textAlign: 'center' }}>
            <div>
              <Star color="var(--color-accent-orange)" size={48} style={{ marginBottom: '16px' }} />
              <h3>Excelencia</h3>
              <p style={{ marginTop: '8px', color: 'var(--color-text-muted)' }}>Buscamos la máxima calidad en cada paso educativo.</p>
            </div>
            <div>
              <Heart color="var(--color-accent-red)" size={48} style={{ marginBottom: '16px' }} />
              <h3>Empatía</h3>
              <p style={{ marginTop: '8px', color: 'var(--color-text-muted)' }}>Formamos ciudadanos conscientes y solidarios.</p>
            </div>
            <div>
              <BookOpen color="var(--color-accent-green)" size={48} style={{ marginBottom: '16px' }} />
              <h3>Innovación</h3>
              <p style={{ marginTop: '8px', color: 'var(--color-text-muted)' }}>Preparamos para los desafíos del futuro.</p>
            </div>
          </div>
        </div>
      </section>

      <Reviews />

      {/* Modal de Detalle de Evento (Opción A) */}
      {activeEvent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={() => setActiveEvent(null)}>
          <div className="card animate-fade-in" style={{
            width: '100%',
            maxWidth: '550px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden'
          }}
          onClick={e => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '24px 24px 16px',
              borderBottom: '1px solid #F1F5F9'
            }}>
              <span className="badge" style={{
                fontSize: '0.75rem',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 'bold',
                ...getTagStyles(activeEvent.tag)
              }}>
                {activeEvent.tag}
              </span>
              <button 
                onClick={() => setActiveEvent(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  borderRadius: '50%',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>

            <div className="card-body" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', alignItems: 'center' }}>
                {/* Calendario miniatura gigante */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '80px',
                  height: '85px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-md)',
                  flexShrink: 0,
                  border: '1px solid #E2E8F0'
                }}>
                  <div style={{
                    backgroundColor: 'var(--color-accent-orange)',
                    color: 'white',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    padding: '6px 0',
                    textTransform: 'uppercase'
                  }}>
                    {activeEvent.mes}
                  </div>
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    color: 'var(--color-primary)',
                    fontSize: '1.9rem',
                    fontWeight: '800',
                    lineHeight: '1.2',
                    padding: '6px 0'
                  }}>
                    {activeEvent.dia}
                  </div>
                </div>

                <h3 style={{
                  fontSize: '1.4rem',
                  color: 'var(--color-primary)',
                  fontWeight: '800',
                  margin: 0,
                  lineHeight: '1.3'
                }}>
                  {activeEvent.titulo}
                </h3>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                backgroundColor: '#F8FAFC',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '24px',
                border: '1px solid #F1F5F9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: 'var(--color-text-main)' }}>
                  <Clock size={16} color="var(--color-accent-orange)" style={{ flexShrink: 0 }} />
                  <span><strong>Horario:</strong> {activeEvent.hora}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: 'var(--color-text-main)' }}>
                  <MapPin size={16} color="var(--color-accent-orange)" style={{ flexShrink: 0 }} />
                  <span><strong>Lugar:</strong> {activeEvent.lugar}</span>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: '8px', fontWeight: 'bold' }}>
                  Detalles del Evento
                </h4>
                <p style={{
                  fontSize: '1rem',
                  color: 'var(--color-text-main)',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-line',
                  margin: 0
                }}>
                  {activeEvent.descripcion}
                </p>
              </div>

              <button 
                className="btn btn-primary"
                onClick={() => setActiveEvent(null)}
                style={{ width: '100%', padding: '12px', fontWeight: 'bold' }}
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
