import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });


  const login = async (email, password) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        const loggedUser = {
          id:
            data.id, name: data.nombre, role:
            data.rol, email: data.email
        };

        setUser(loggedUser);

        localStorage.setItem('user', JSON.stringify(loggedUser));
        return true;

      } else {
        const errData = await response.json();
        throw new Error(errData.message || 'Credenciales inválidas');
      }
    } catch (err) {
      console.error('Error de autenticación:', err.message);
      alert(err.message === 'Failed to fetch' ? 'Error: El servidor no está respondiendo. Asegúrate de ejecutar npm run dev.' : err.message);
      return false;
    }
  };

  const register = (userData) => {
    const newUser = {
      id: 4, name:
        userData.nombre, role:
        userData.rol, email: userData.email
    };

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
