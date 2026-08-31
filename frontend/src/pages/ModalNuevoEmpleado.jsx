import { useState } from 'react';
import api from '../services/api';
import { X, CheckCircle, AlertCircle, Save } from 'lucide-react';

export default function ModalNuevoEmpleado({ isOpen, onClose, onSuccess }) {
  // Estado inicial del formulario vacío
  const initialState = {
    ci: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    fechaNacimiento: '',
    genero: 'MASCULINO',
    telefono: '',
    direccion: '',
    rolNombre: 'RECEPCIONISTA',
    sucursalBaseId: '1', // Por defecto Sucursal 1
    salarioFijo: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Guardamos la data del éxito (para mostrar la contraseña generada)
  const [successData, setSuccessData] = useState(null);

  // Si el modal está cerrado, no renderizamos nada
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClose = () => {
    setFormData(initialState);
    setError(null);
    setSuccessData(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Formateamos los datos para que coincidan con el DTO de Spring Boot
      const payload = {
        ...formData,
        sucursalBaseId: parseInt(formData.sucursalBaseId),
        salarioFijo: formData.salarioFijo ? parseFloat(formData.salarioFijo) : null
      };

      const response = await api.post('/propietario/empleados', payload);
      
      // Si todo sale bien, guardamos la respuesta para mostrar la contraseña
      setSuccessData(response.data);
      
      // Llamamos a la función onSuccess para que la tabla de fondo se actualice
      if (onSuccess) onSuccess();
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al registrar el empleado. Revisa la conexión.');
    } finally {
      setLoading(false);
    }
  };

  // --- VISTA DE ÉXITO (Muestra la contraseña) ---
  if (successData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden text-center p-8">
          <div className="mx-auto w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Empleado Registrado!</h2>
          <p className="text-gray-500 mb-6">Entrega estas credenciales al nuevo empleado para que pueda ingresar al sistema.</p>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-left space-y-3">
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Usuario (CI)</span>
              <p className="font-mono text-lg text-gray-800">{successData.ci}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Contraseña Temporal</span>
              <p className="font-mono text-xl text-megatlon-primary font-bold bg-red-50 p-2 rounded inline-block">{successData.passwordGeneradaPlana}</p>
            </div>
          </div>

          <button 
            onClick={handleClose}
            className="w-full bg-megatlon-primary text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Entendido, Cerrar
          </button>
        </div>
      </div>
    );
  }

  // --- VISTA DEL FORMULARIO ---
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Registrar Nuevo Personal</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Cuerpo (Formulario con scroll) */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
              <AlertCircle className="mt-0.5 shrink-0" size={18} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form id="formEmpleado" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombres y Apellidos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primer Nombre *</label>
                <input required type="text" name="primerNombre" value={formData.primerNombre} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-megatlon-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Nombre</label>
                <input type="text" name="segundoNombre" value={formData.segundoNombre} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-megatlon-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido *</label>
                <input required type="text" name="primerApellido" value={formData.primerApellido} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-megatlon-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido</label>
                <input type="text" name="segundoApellido" value={formData.segundoApellido} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-megatlon-primary focus:outline-none" />
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carnet de Identidad (CI) *</label>
                <input required type="text" name="ci" value={formData.ci} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-megatlon-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento *</label>
                <input required type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-megatlon-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Género *</label>
                <select name="genero" value={formData.genero} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-megatlon-primary focus:outline-none">
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMENINO">Femenino</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                <input required type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-megatlon-primary focus:outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                <input required type="text" name="direccion" value={formData.direccion} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-megatlon-primary focus:outline-none" />
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Rol *</label>
                <select name="rolNombre" value={formData.rolNombre} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-megatlon-primary focus:outline-none">
                  <option value="RECEPCIONISTA">Recepcionista</option>
                  <option value="INSTRUCTOR">Instructor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Sucursal *</label>
                <select name="sucursalBaseId" value={formData.sucursalBaseId} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-megatlon-primary focus:outline-none">
                  <option value="1">1 - Sede Norte</option>
                  <option value="2">2 - Sede Sur</option>
                  <option value="3">3 - Sede Este</option>
                  <option value="4">4 - Sede Oeste</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Salario Fijo (Bs)</label>
                <input type="number" step="0.01" name="salarioFijo" value={formData.salarioFijo} onChange={handleChange} placeholder="Ej. 3350" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-megatlon-primary focus:outline-none" />
              </div>
            </div>

          </form>
        </div>

        {/* Footer con botones */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button type="button" onClick={handleClose} disabled={loading} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">
            Cancelar
          </button>
          <button type="submit" form="formEmpleado" disabled={loading} className="flex items-center gap-2 bg-megatlon-primary hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50">
            <Save size={20} />
            {loading ? 'Guardando...' : 'Registrar Empleado'}
          </button>
        </div>

      </div>
    </div>
  );
}