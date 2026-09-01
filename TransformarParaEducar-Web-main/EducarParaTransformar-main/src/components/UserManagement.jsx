import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Edit, UserX, UserCheck, Key } from 'lucide-react';

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ nombre: '', email: '', password: '', rol: 'alumno' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        // Docentes solo ven alumnos y padres
        if (currentUser.role === 'docente') {
          setUsers(data.filter(u => u.rol === 'alumno' || u.rol === 'padre'));
        } else {
          setUsers(data);
        }
      })
      .catch(err => console.error(err));
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(() => {
      fetchUsers();
      setNewUser({ nombre: '', email: '', password: '', rol: 'alumno' });
      alert('Usuario creado exitosamente');
    })
    .catch(err => {
      console.error(err);
      alert('Hubo un error al crear el usuario. Asegúrate de reiniciar el servidor (npm run dev) para aplicar los últimos cambios del backend.');
    });
  };

  const toggleStatus = (id, currentStatus) => {
    fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: !currentStatus })
    }).then(() => fetchUsers());
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este usuario?')) {
      fetch(`/api/users/${id}`, { method: 'DELETE' })
        .then(() => fetchUsers());
    }
  };

  const handleChangePassword = (id, nombre) => {
    const newPassword = window.prompt(`Introduce la nueva contraseña para el usuario ${nombre}:`);
    if (newPassword) {
      fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      })
      .then(res => {
        if (!res.ok) throw new Error('Error al actualizar contraseña');
        alert(`Contraseña de ${nombre} actualizada exitosamente.`);
      })
      .catch(err => {
        console.error(err);
        alert('Hubo un error al cambiar la contraseña.');
      });
    }
  };

  return (
    <div className="card" style={{ marginTop: '32px' }}>
      <div className="card-body">
        <h3 style={{ marginBottom: '24px' }}>Gestión de Usuarios</h3>
        
        {currentUser.role === 'autoridad' && (
          <form onSubmit={handleCreateUser} style={{ marginBottom: '32px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '16px' }}>Crear Nuevo Usuario</h4>
            <div className="grid-2" style={{ gap: '16px', marginBottom: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <input required type="text" className="form-input" placeholder="Nombre completo" pattern="[A-Za-zÀ-ÿ\s]+" title="Solo se permiten letras y espacios" value={newUser.nombre} onChange={e => setNewUser({...newUser, nombre: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <input required type="email" className="form-input" placeholder="Correo electrónico" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <input required type="password" className="form-input" placeholder="Contraseña" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <select className="form-select" value={newUser.rol} onChange={e => setNewUser({...newUser, rol: e.target.value})}>
                  <option value="alumno">Alumno</option>
                  <option value="padre">Padre/Tutor</option>
                  <option value="docente">Docente</option>
                  <option value="autoridad">Administrador</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Crear Usuario</button>
          </form>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '12px 8px' }}>Nombre</th>
                <th style={{ padding: '12px 8px' }}>Email</th>
                <th style={{ padding: '12px 8px' }}>Rol</th>
                <th style={{ padding: '12px 8px' }}>Estado</th>
                <th style={{ padding: '12px 8px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '12px 8px', fontWeight: '500' }}>{u.nombre}</td>
                  <td style={{ padding: '12px 8px' }}>{u.email}</td>
                  <td style={{ padding: '12px 8px', textTransform: 'capitalize' }}>
                    <span className={`badge ${u.rol === 'autoridad' ? 'badge-pink' : u.rol === 'docente' ? 'badge-orange' : u.rol === 'padre' ? 'badge-blue' : 'badge-green'}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    {u.activo ? <span style={{ color: 'var(--color-accent-green)', fontWeight: 'bold' }}>Activo</span> : <span style={{ color: 'var(--color-accent-red)' }}>Bloqueado</span>}
                  </td>
                  <td style={{ padding: '12px 8px', display: 'flex', gap: '8px' }}>
                    <button onClick={() => toggleStatus(u.id, u.activo)} title={u.activo ? "Bloquear" : "Desbloquear"} style={{ background: 'none', border: 'none', cursor: 'pointer', color: u.activo ? 'var(--color-accent-orange)' : 'var(--color-accent-green)' }}>
                      {u.activo ? <UserX size={18} /> : <UserCheck size={18} />}
                    </button>
                    {currentUser.role === 'autoridad' && (
                      <>
                        <button onClick={() => handleChangePassword(u.id, u.nombre)} title="Cambiar Contraseña" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}>
                          <Key size={18} />
                        </button>
                        <button onClick={() => handleDelete(u.id)} title="Eliminar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent-red)' }}>
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No hay usuarios para mostrar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
