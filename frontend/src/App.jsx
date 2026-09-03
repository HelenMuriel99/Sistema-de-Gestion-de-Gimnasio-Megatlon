import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

import Pos from './pages/Pos';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Empleados from './pages/Empleados';
import Clientes from './pages/Clientes';
import Membresias from './pages/Membresias';

// Componente guardián para proteger las rutas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-xl">Cargando sistema...</div>;
  
  if (!user) return <Navigate to="/" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/" element={<Login />} />
          
          {/* Rutas protegidas (Dentro del Layout) */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/empleados" element={<Empleados />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/membresias" element={<Membresias />} />
            <Route path="/pos" element={<Pos />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;