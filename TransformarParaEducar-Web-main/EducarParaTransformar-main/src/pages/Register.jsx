import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'padre'
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    register(formData);
    navigate('/dashboard');
  };

  return (
    <div className="animate-fade-in" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-light)', padding: '40px 0' }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="card-body" style={{ padding: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>Crear Cuenta</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Únete a nuestra comunidad educativa.</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid-2" style={{ gap: '16px', marginBottom: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Nombre</label>
                <input required type="text" className="form-input" pattern="[A-Za-zÀ-ÿ\s]+" title="Solo se permiten letras y espacios" onChange={e => setFormData({...formData, nombre: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Apellido</label>
                <input required type="text" className="form-input" pattern="[A-Za-zÀ-ÿ\s]+" title="Solo se permiten letras y espacios" onChange={e => setFormData({...formData, apellido: e.target.value})} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input required type="email" className="form-input" onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input required type="password" className="form-input" onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>

            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label">Rol en la Institución</label>
              <select className="form-select" value={formData.rol} onChange={e => setFormData({...formData, rol: e.target.value})}>
                <option value="padre">Padre / Tutor</option>
                <option value="alumno">Alumno</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem' }}>
              Registrarse
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            ¿Ya tienes cuenta? <Link to="/acceso" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Inicia Sesión aquí</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
