import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Calendar, Clock, MapPin } from 'lucide-react';

export default function EventManager() {
  const { user } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [newEvent, setNewEvent] = useState({
    titulo: '',
    descripcion: '',
    dia: '',
    mes: 'Jun',
    hora: '',
    lugar: '',
    tag: 'Institucional'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEventos(data))
      .catch(err => console.error('Error al cargar eventos:', err));
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.titulo || !newEvent.descripcion || !newEvent.dia || !newEvent.mes || !newEvent.hora || !newEvent.lugar) {
      alert('Por favor completa todos los campos.');
      return;
    }

    // Validar día es número de 2 dígitos
    if (isNaN(newEvent.dia) || newEvent.dia.length > 2 || parseInt(newEvent.dia) < 1 || parseInt(newEvent.dia) > 31) {
      alert('Por favor ingresa un día válido (1 al 31).');
      return;
    }

    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    })
    .then(res => {
      if (!res.ok) throw new Error('Error al guardar el evento');
      return res.json();
    })
    .then(() => {
      fetchEvents();
      setNewEvent({
        titulo: '',
        descripcion: '',
        dia: '',
        mes: 'Jun',
        hora: '',
        lugar: '',
        tag: 'Institucional'
      });
      alert('Evento creado exitosamente.');
    })
    .catch(err => {
      console.error(err);
      alert('Hubo un error al crear el evento.');
    });
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este evento?')) {
      fetch(`/api/events/${id}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok) throw new Error('Error al eliminar');
          fetchEvents();
        })
        .catch(err => console.error(err));
    }
  };

  const getTagBadgeClass = (tag) => {
    switch (tag?.toLowerCase()) {
      case 'institucional':
        return 'badge-blue';
      case 'deportes':
        return 'badge-green';
      case 'familias':
        return 'badge-pink';
      default:
        return 'badge-orange';
    }
  };

  return (
    <div className="card" style={{ marginTop: '32px' }}>
      <div className="card-body">
        <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={24} color="var(--color-primary)" />
          Gestión de Eventos Escolares
        </h3>

        {/* Formulario de creación de eventos */}
        <form onSubmit={handleCreateEvent} style={{ marginBottom: '32px', backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <h4 style={{ marginBottom: '16px' }}>Publicar Nuevo Evento</h4>
          <div className="grid-2" style={{ gap: '16px', marginBottom: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Título del Evento</label>
              <input required type="text" className="form-input" placeholder="Ej: Feria de Ciencias" pattern=".*[A-Za-zÀ-ÿ].*" title="El título debe contener al menos una letra" value={newEvent.titulo} onChange={e => setNewEvent({...newEvent, titulo: e.target.value})} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Tema / Categoría</label>
              <select className="form-select" value={newEvent.tag} onChange={e => setNewEvent({...newEvent, tag: e.target.value})}>
                <option value="Institucional">Institucional</option>
                <option value="Deportes">Deportes</option>
                <option value="Familias">Familias</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Día (Ej: 12)</label>
              <input required type="text" maxLength="2" className="form-input" placeholder="Día" value={newEvent.dia} onChange={e => setNewEvent({...newEvent, dia: e.target.value.replace(/\D/g, '')})} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Mes</label>
              <select className="form-select" value={newEvent.mes} onChange={e => setNewEvent({...newEvent, mes: e.target.value})}>
                <option value="Ene">Enero (Ene)</option>
                <option value="Feb">Febrero (Feb)</option>
                <option value="Mar">Marzo (Mar)</option>
                <option value="Abr">Abril (Abr)</option>
                <option value="May">Mayo (May)</option>
                <option value="Jun">Junio (Jun)</option>
                <option value="Jul">Julio (Jul)</option>
                <option value="Ago">Agosto (Ago)</option>
                <option value="Sep">Septiembre (Sep)</option>
                <option value="Oct">Octubre (Oct)</option>
                <option value="Nov">Noviembre (Nov)</option>
                <option value="Dic">Diciembre (Dic)</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Hora / Horario (Ej: 09:00 - 15:00 hs)</label>
              <input required type="text" className="form-input" placeholder="Horario" pattern="([01][0-9]|2[0-3]):[0-5][0-9].*" title="Debe comenzar con formato HH:MM válido (ej: 09:00)" value={newEvent.hora} onChange={e => setNewEvent({...newEvent, hora: e.target.value})} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Lugar o Ubicación (Ej: Salón de Actos Principal)</label>
            <input required type="text" className="form-input" placeholder="Lugar del evento" pattern=".*[A-Za-zÀ-ÿ].*" title="El lugar debe contener al menos una letra" value={newEvent.lugar} onChange={e => setNewEvent({...newEvent, lugar: e.target.value})} />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Descripción del Evento (Detalles completos)</label>
            <textarea required className="form-textarea" rows="3" placeholder="Escribe aquí de qué trata el evento y toda la información adicional..." value={newEvent.descripcion} onChange={e => setNewEvent({...newEvent, descripcion: e.target.value})}></textarea>
          </div>

          <button type="submit" className="btn btn-primary">Crear Evento</button>
        </form>

        {/* Listado de eventos para eliminación */}
        <h4 style={{ marginBottom: '16px' }}>Eventos Actuales</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '12px 8px' }}>Fecha</th>
                <th style={{ padding: '12px 8px' }}>Título</th>
                <th style={{ padding: '12px 8px' }}>Tema</th>
                <th style={{ padding: '12px 8px' }}>Lugar y Horario</th>
                <th style={{ padding: '12px 8px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map(event => (
                <tr key={event.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 'bold', color: 'var(--color-accent-orange)' }}>
                    {event.dia} {event.mes}
                  </td>
                  <td style={{ padding: '12px 8px', fontWeight: '500' }}>
                    <div style={{ fontWeight: 'bold' }}>{event.titulo}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {event.descripcion}
                    </div>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <span className={`badge ${getTagBadgeClass(event.tag)}`}>
                      {event.tag}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {event.lugar}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', color: 'var(--color-text-muted)' }}><Clock size={12} /> {event.hora}</div>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <button 
                      onClick={() => handleDeleteEvent(event.id)} 
                      title="Eliminar evento" 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent-red)', padding: '4px' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {eventos.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No hay eventos programados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
