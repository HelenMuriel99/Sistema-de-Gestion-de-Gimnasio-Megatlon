import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login() {
  const [ci, setCi] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingReq, setLoadingReq] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Limpiar errores previos
    setLoadingReq(true);

    try {
      // Petición al backend
      const response = await api.post('/auth/login', { 
        ci: ci.trim(), 
        password 
      });
      
      // Guardar token y redirigir
      login(response.data.token);
      navigate('/dashboard');

    } catch (error) {
      // 1. Validar si el backend respondió con un código de error de autenticación/permisos
      if (error.response) {
        if ([400, 401, 403].includes(error.response.status)) {
          // Captura el mensaje que envía el backend, o muestra uno genérico si viene vacío
          setErrorMessage(
            error.response.data?.message || 'Credenciales incorrectas o usuario sin acceso.'
          );
        } else {
          setErrorMessage(`Error en el servidor: ${error.response.status}`);
        }
      } 
      // 2. Si no hay 'response', el servidor está caído o hay problema de red
      else if (error.request) {
        setErrorMessage('Error de conexión con el servidor. ¿Está encendido el Backend?');
      } 
      // 3. Otros errores no mapeados
      else {
        setErrorMessage('Ocurrió un error inesperado. Intente nuevamente.');
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

        {/* Alerta de error dinámico */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm font-medium">
            <span className="block sm:inline">{errorMessage}</span>
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-megatlon-primary transition duration-150"
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              placeholder="Ej. 1234567"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-megatlon-primary transition duration-150"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loadingReq}
            className="w-full bg-megatlon-primary hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingReq ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Verificando...</span>
              </>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

      </div>
    </div>
  );
}