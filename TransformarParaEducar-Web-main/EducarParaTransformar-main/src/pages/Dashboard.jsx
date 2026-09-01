import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserManagement from '../components/UserManagement';
import EventManager from '../components/EventManager';

export default function Dashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (user && (user.role === 'docente' || user.role === 'autoridad')) {
      fetch('/api/jobs')
        .then(res => res.json())
        .then(data => setJobs(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  const [inscripciones, setInscripciones] = useState([]);

useEffect(() => {
  fetch('/api/inscripciones')
    .then(res => res.json())
    .then(data => setInscripciones(data))
    .catch(err => console.error("Error al cargar inscripciones:", err));
}, []);

  if (!user) {
    return <Navigate to="/acceso" />;
  }

  return (
    <div className="animate-fade-in container" style={{ padding: '40px 24px' }}>
      <h1 style={{ marginBottom: '8px' }}>Bienvenido, {user.name}</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
        Panel de control - Rol: <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{user.role}</span>
      </p>

      {user.role === 'autoridad' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-body">
              <h3>Administración Global</h3>
              <p style={{ color: 'var(--color-text-muted)', marginTop: '8px', marginBottom: '16px' }}>
                Como autoridad, tienes control total sobre la plataforma.
              </p>
              <ul style={{ paddingLeft: '20px', color: 'var(--color-text-muted)' }}>
                <li>Crear y editar Noticias desde la sección "Noticias".</li>
                <li>Moderar y eliminar Opiniones de usuarios en la página principal.</li>
                <li>Modificar información institucional (próximamente).</li>
              </ul>
            </div>
          </div>

        </div>
      )}

      {user.role === 'autoridad' && <UserManagement />}
      {user.role === 'autoridad' && <EventManager />}

      {user.role === 'docente' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-body">
              <h3 style={{ marginBottom: '16px' }}>Inscripciones Recientes</h3>
    
              {inscripciones.length === 0 ? (
               <p style={{ color: 'var(--color-text-muted)' }}>No hay inscripciones nuevas.</p>
              ) : (
                inscripciones.map(ins => (
                  <div key={ins.id} style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', marginBottom: '12px' }}>
                    <strong>Aspirante:</strong> {ins.nombre_aspirante} {ins.apellido_aspirante} ({ins.nivel})<br/>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Tutor: {ins.nombre_tutor} {ins.apellido_tutor} - Estado: {ins.estado}
                    </span>
                  </div>
                ))
              )}  
        </div>
      </div>
          <div className="card" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <div className="card-body">
              <h3 style={{ marginBottom: '16px' }}>Postulaciones de Empleo (CVs)</h3>
              {jobs.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)' }}>No hay postulaciones recientes.</p>
              ) : (
                jobs.map(job => (
                  <div key={job.id} style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', marginBottom: '12px' }}>
                    <strong>Candidato:</strong> {job.nombre} {job.apellido}<br/>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Puesto: {job.puesto} - <a href={job.cv_url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>Ver CV</a></span>
                    {job.mensaje && <p style={{ fontSize: '0.85rem', marginTop: '8px', fontStyle: 'italic', color: '#64748B' }}>"{job.mensaje}"</p>}
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="card" style={{ gridColumn: '1 / -1' }}>
              <div className="card-body">
                <h3>Envío de Comunicados (Próximamente)</h3>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '8px', marginBottom: '16px' }}>
                  Este espacio estará reservado para incorporar el envío de comunicados directos, ya sea para los alumnos, para los padres o para ambos.
                </p>
             </div>
          </div>
        </div>
      )}

      {user.role === 'docente' && <UserManagement />}
      {user.role === 'docente' && <EventManager />}

      {(user.role === 'padre' || user.role === 'alumno') && (
        <div className="card">
          <div className="card-body">
            <h3>Portal Académico</h3>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '8px' }}>
              Aquí podrás ver tus calificaciones, asistencia y comunicados recientes de los docentes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
