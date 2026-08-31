import { useState, useEffect } from 'react';
import api from '../services/api';
import { X, AlertCircle, Save } from 'lucide-react';

export default function ModalEditarEmpleado({ isOpen, onClose, onSuccess, empleado }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cuando el modal se abre y recibe al "empleado", llenamos el formulario
  useEffect(() => {
    if (empleado) {
      setFormData({
        primerNombre: empleado.primerNombre || '',
        segundoNombre: empleado.segundoNombre || '',
        primerApellido: empleado.primerApellido || '',
        segundoApellido: empleado.segundoApellido || '',
        telefono: empleado.telefono || '',
        direccion: empleado.direccion || '',
        sucursalBaseId: empleado.sucursalId || '1',
        salarioFijo: empleado.salarioFijo || ''
      });
    }
  }, [empleado]);

  if (!isOpen || !empleado) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // El endpoint de Fabrizzio requiere el CI en la URL y los datos en el body
      const payload = {
        ...formData,
        sucursalBaseId: parseInt(formData.sucursalBaseId),
        salarioFijo: formData.salarioFijo ? parseFloat(formData.salarioFijo) : null
      };

      await api.put(`/propietario/gestion/usuarios/${empleado.ci}`, payload);
      
      // Si todo sale bien, actualizamos la tabla de fondo y cerramos
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al actualizar el empleado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Editar Empleado</h2>
            <p className="text-sm text-gray-500">CI: {empleado.ci}</p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
              <AlertCircle className="mt-0.5 shrink-0" size={18} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form id="formEditarEmpleado" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primer Nombre *</label>
                <input required type="text" name="primerNombre" value={formData.primerNombre || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-megatlon-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Nombre</label>
                <input type="text" name="segundoNombre" value={formData.segundoNombre || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-megatlon-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido *</label>
                <input required type="text" name="primerApellido" value={formData.primerApellido || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-megatlon-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido</label>
                <input type="text" name="segundoApellido" value={formData.segundoApellido || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-megatlon-primary focus:outline-none" />
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                <input required type="text" name="telefono" value={formData.telefono || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-megatlon-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                <input required type="text" name="direccion" value={formData.direccion || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-megatlon-primary focus:outline-none" />
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Sucursal Base</label>
                <select name="sucursalBaseId" value={formData.sucursalBaseId || '1'} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-megatlon-primary focus:outline-none">
                  <option value="1">1 - Sede Norte</option>
                  <option value="2">2 - Sede Sur</option>
                  <option value="3">3 - Sede Este</option>
                  <option value="4">4 - Sede Oeste</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Salario Fijo (Bs)</label>
                <input type="number" step="0.01" name="salarioFijo" value={formData.salarioFijo || ''} onChange={handleChange} placeholder="Ej. 3350" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-megatlon-primary focus:outline-none" />
              </div>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button type="button" onClick={handleClose} disabled={loading} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">
            Cancelar
          </button>
          <button type="submit" form="formEditarEmpleado" disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50">
            <Save size={20} />
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

      </div>
    </div>
  );
}