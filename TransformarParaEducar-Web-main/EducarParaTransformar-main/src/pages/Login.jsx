import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };
  return (
    <div className="animate-fade-in" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-light)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body" style={{ padding: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>Acceso al Portal</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Docentes, Autoridades, Alumnos y Padres.</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input required type="email" className="form-input" placeholder="usuario@educartransformar.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            
            <div className="form-group" style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Contraseña</label>
                <a href="#" style={{ fontSize: '0.85rem', color: 'var(--color-accent-orange)' }}>¿Olvidaste tu clave?</a>
              </div>
              <input required type="password" className="form-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem' }}>
              Ingresar
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            ¿No tienes cuenta? <Link to="/registro" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Solicitar registro o crear cuenta</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
