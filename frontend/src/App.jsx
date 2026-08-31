import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Empleados from './pages/Empleados';

// Componente guardián: Protege las rutas internas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-megatlon-dark flex items-center justify-center">
        <p className="text-megatlon-primary font-bold text-xl">Cargando Sistema...</p>
      </div>
    );
  }
  
  // Si no hay usuario, lo devolvemos al Login
  if (!user) return <Navigate to="/" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta Pública */}
          <Route path="/" element={<Login />} />
          
          {/* Rutas Privadas envueltas en el Layout */}
          <Route 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Todas estas rutas se inyectan en el <Outlet /> de Layout.jsx */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Aquí agregaremos las demás pantallas luego */}
            {<Route path="/empleados" element={<Empleados />} />}
            {<Route path="/clientes" element={<Clientes />} />}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;