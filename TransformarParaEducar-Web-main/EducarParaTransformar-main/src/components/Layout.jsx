import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = [
    { name: 'Inicio', path: '/' },
    { name: 'Quiénes Somos', path: '/quienes-somos' },
    { name: 'Niveles', path: '/niveles' },
    { name: 'Bienestar', path: '/bienestar' },
    { name: 'Noticias', path: '/noticias' },
    { name: 'Inscripción', path: '/inscripcion' },
    { name: 'Empleo', path: '/empleo' },
  ];

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="container navbar-container">
          <Link to="/" className="logo" style={{ marginLeft: '-35px' }}>
            <img src="/favicon.png" alt="Logo" style={{ width: '56px', height: '56px', objectFit: 'contain', backgroundColor: 'white', borderRadius: '50%', padding: '4px' }} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textShadow: '1px 1px 2px #000' }}>
              <span style={{ color: '#3B82F6' }}>Educar</span>
              <span style={{ color: '#EC4899', fontWeight: '600' }}>para</span>
              <span style={{ color: '#FBBF24' }}>Transformar</span>
            </span>
          </Link>
          <div className="nav-links">
            {links.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Link to="/dashboard" className="btn" style={{ backgroundColor: '#E2E8F0', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LayoutDashboard size={18} /> Panel
                </Link>
                <button onClick={handleLogout} className="btn" style={{ backgroundColor: 'transparent', color: 'var(--color-accent-red)', padding: '8px', border: '1px solid var(--color-accent-red)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LogOut size={18} /> Salir
                </button>
              </div>
            ) : (
              <Link to="/acceso" className="btn btn-primary" style={{ padding: '8px 16px' }}>
                Acceso
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main style={{ minHeight: '80vh' }}>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="logo" style={{ marginBottom: '16px', marginLeft: '-30px' }}>
                <img src="/favicon.png" alt="Logo" style={{ width: '56px', height: '56px', objectFit: 'contain', backgroundColor: 'white', borderRadius: '50%', padding: '4px' }} />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textShadow: '1px 1px 2px #000' }}>
                  <span style={{ color: '#3B82F6' }}>Educar</span>
                  <span style={{ color: '#EC4899', fontWeight: '600' }}>para</span>
                  <span style={{ color: '#FBBF24' }}>Transformar</span>
                </span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                Inspiramos, desafiamos y empoderamos a todos nuestros alumnos para que alcancen su máximo potencial.
              </p>
            </div>
            <div className="footer-col">
              <h3>Contacto</h3>
              <ul className="footer-links">
                <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <MapPin size={18} /> Av. 1234, Resistencia Chaco
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Phone size={18} /> +54 3624 1234-5678
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Mail size={18} /> info@educartransformar.edu
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>Enlaces Rápidos</h3>
              <ul className="footer-links">
                <li><Link to="/inscripcion">Solicitud de Inscripción</Link></li>
                <li><Link to="/empleo">Trabaja con Nosotros</Link></li>
                <li><Link to="/acceso">Portal Educativo</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Centro Educativo Educar para Transformar. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
