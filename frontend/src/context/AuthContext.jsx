import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Creamos el contexto
export const AuthContext = createContext();

// Creamos el proveedor que envolverá nuestra aplicación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Este useEffect se ejecuta una vez al recargar la página
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Desencriptamos el token para leer los datos que Fabrizzio guardó dentro
        const decoded = jwtDecode(token);
        
        setUser({
          ci: decoded.sub, // En JWT, 'sub' (subject) suele ser el CI
          rol: decoded.rol,
          sucursalId: decoded.sucursalId,
          nombre: decoded.nombre
        });
      } catch (error) {
        console.error("Token inválido o expirado", error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Función para iniciar sesión (se llamará desde la pantalla de Login)
  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    
    setUser({
      ci: decoded.sub,
      rol: decoded.rol,
      sucursalId: decoded.sucursalId,
      nombre: decoded.nombre
    });
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};