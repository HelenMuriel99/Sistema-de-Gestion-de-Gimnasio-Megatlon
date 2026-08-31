import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
  const [ci, setCi] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingReq, setLoadingReq] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingReq(true);

    try {
      // Llamamos al endpoint de Fabrizzio
      const response = await api.post('/auth/login', { ci, password });
      
      // Si el login es exitoso, pasamos el token al AuthContext
      login(response.data.token);
      
      // Y redirigimos al usuario adentro del sistema
      navigate('/dashboard');
      
    } catch (err) {
      if (err.response && err.response.data) {
        // Mostramos el mensaje de error del backend (ej. "Usuario bloqueado")
        setError(err.response.data.message || 'Credenciales incorrectas');
      } else {
        setError('Error de conexión con el servidor. ¿Está encendido el Backend?');
      }
    } finally {
      setLoadingReq(false);
    }
  };

  return (
    <div className="min-h-screen bg-megatlon-dark flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-megatlon-primary tracking-tighter">MEGATLON</h1>
          <p className="text-gray-500 mt-2">Sistema de Gestión</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Carnet de Identidad (CI) o Usuario
            </label>
            <input 
              type="text" 
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-megatlon-primary"
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              placeholder="Ej. 1234567"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña
            </label>
            <input 
              type="password" 
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-megatlon-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>

          <button 
            type="submit" 
            disabled={loadingReq}
            className="w-full bg-megatlon-primary hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
          >
            {loadingReq ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>

      </div>
    </div>
  );
}
