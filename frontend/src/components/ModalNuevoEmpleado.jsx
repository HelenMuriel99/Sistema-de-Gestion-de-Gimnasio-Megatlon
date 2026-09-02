import { useState } from 'react';
import api from '../services/api';
import { X, CheckCircle, AlertCircle, Save } from 'lucide-react';

export default function ModalNuevoEmpleado({ isOpen, onClose, onSuccess }) {
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
    sucursalBaseId: '1',
    salarioFijo: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let valorLimpio = value;

    // Filtros en tiempo real para evitar caracteres inválidos
    if (name === 'ci' || name === 'telefono') {
      valorLimpio = value.replace(/\D/g, ''); // Solo números
    } else if (name === 'primerNombre' || name === 'segundoNombre' || name === 'primerApellido' || name === 'segundoApellido') {
      valorLimpio = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); // Solo letras y espacios
    }

    setFormData((prev) => ({ ...prev, [name]: valorLimpio }));

    // Limpia el error del campo que se está modificando
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    // Validación de Nombres
    if (!formData.primerNombre.trim()) {
      nuevosErrores.primerNombre = 'El primer nombre es obligatorio';
    } else if (!soloLetras.test(formData.primerNombre)) {
      nuevosErrores.primerNombre = 'Solo se permiten letras';
    }

    if (formData.segundoNombre.trim() && !soloLetras.test(formData.segundoNombre)) {
      nuevosErrores.segundoNombre = 'Solo se permiten letras';
    }

    // Validación de Apellidos
    if (!formData.primerApellido.trim()) {
      nuevosErrores.primerApellido = 'El primer apellido es obligatorio';
    } else if (!soloLetras.test(formData.primerApellido)) {
      nuevosErrores.primerApellido = 'Solo se permiten letras';
    }

    if (formData.segundoApellido.trim() && !soloLetras.test(formData.segundoApellido)) {
      nuevosErrores.segundoApellido = 'Solo se permiten letras';
    }

    // Validación de CI (numérico, entre 5 y 10 dígitos)
    if (!formData.ci) {
      nuevosErrores.ci = 'El CI es obligatorio';
    } else if (!/^\d{5,10}$/.test(formData.ci)) {
      nuevosErrores.ci = 'El CI debe tener entre 5 y 10 dígitos';
    }

    // Validación de Teléfono (8 dígitos para telefonía móvil/fija estándar)
    if (!formData.telefono) {
      nuevosErrores.telefono = 'El teléfono es obligatorio';
    } else if (!/^[467]\d{7}$/.test(formData.telefono)) {
      nuevosErrores.telefono = 'Ingrese un número válido de 8 dígitos';
    }

    // Validación de Dirección
    if (!formData.direccion.trim()) {
      nuevosErrores.direccion = 'La dirección es obligatoria';
    }

    // Validación de Fecha de Nacimiento (Mayor de 18 años)
    if (!formData.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    } else {
      const fechaNac = new Date(formData.fechaNacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNac.getFullYear();
      const mes = hoy.getMonth() - fechaNac.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
      }

      if (fechaNac > hoy) {
        nuevosErrores.fechaNacimiento = 'La fecha no puede ser futura';
      } else if (edad < 18) {
        nuevosErrores.fechaNacimiento = 'El empleado debe ser mayor de 18 años';
      }
    }

    // Validación de Salario
    if (formData.salarioFijo && Number(formData.salarioFijo) <= 0) {
      nuevosErrores.salarioFijo = 'El salario debe ser mayor a 0';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleClose = () => {
    setFormData(initialState);
    setErrores({});
    setError(null);
    setSuccessData(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        ci: formData.ci.trim(),
        primerNombre: formData.primerNombre.trim(),
        segundoNombre: formData.segundoNombre.trim() || null,
        primerApellido: formData.primerApellido.trim(),
        segundoApellido: formData.segundoApellido.trim() || null,
        fechaNacimiento: formData.fechaNacimiento,
        genero: formData.genero,
        telefono: formData.telefono.trim(),
        direccion: formData.direccion.trim(),
        rolNombre: formData.rolNombre,
        sucursalBaseId: parseInt(formData.sucursalBaseId, 10),
        salarioFijo: formData.salarioFijo ? parseFloat(formData.salarioFijo) : null
      };

      const response = await api.post('/propietario/empleados', payload);
      setSuccessData(response.data);
      if (onSuccess) onSuccess();
      
    } catch (err) {
      console.error(err);
      
      const serverMessage = err.response?.data?.message || err.response?.data;

      // Verificación de CI duplicado (Status 409, 400 o texto descriptivo)
      if (
        err.response?.status === 403 || 
        (typeof serverMessage === 'string' && serverMessage.toLowerCase().includes('ci'))
      ) {
        setError('Ya existe un usuario o empleado registrado con este Carnet de Identidad (CI).');
      } else if (typeof serverMessage === 'string' && serverMessage) {
        setError(serverMessage);
      } else {
        setError('Error al registrar el empleado. Revisa la conexión o tus permisos.');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- VISTA DE ÉXITO ---
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
              <p className="font-mono text-xl text-red-600 font-bold bg-red-50 p-2 rounded inline-block">
                {successData.passwordGeneradaPlana}
              </p>
            </div>
          </div>

          <button 
            onClick={handleClose}
            className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors"
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
        
        {/* Cabecera */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Registrar Nuevo Personal</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
              <AlertCircle className="mt-0.5 shrink-0" size={18} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form id="formEmpleado" onSubmit={handleSubmit} className="space-y-6" noValidate>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primer Nombre *</label>
                <input 
                  type="text" 
                  name="primerNombre" 
                  value={formData.primerNombre} 
                  onChange={handleChange} 
                  placeholder="Ej. Juan"
                  className={`w-full border rounded-lg p-2 focus:ring-2 focus:outline-none ${errores.primerNombre ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-red-500'}`} 
                />
                {errores.primerNombre && <p className="text-red-500 text-xs mt-1">{errores.primerNombre}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Nombre</label>
                <input 
                  type="text" 
                  name="segundoNombre" 
                  value={formData.segundoNombre} 
                  onChange={handleChange} 
                  placeholder="Ej. Carlos"
                  className={`w-full border rounded-lg p-2 focus:ring-2 focus:outline-none ${errores.segundoNombre ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-red-500'}`} 
                />
                {errores.segundoNombre && <p className="text-red-500 text-xs mt-1">{errores.segundoNombre}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido *</label>
                <input 
                  type="text" 
                  name="primerApellido" 
                  value={formData.primerApellido} 
                  onChange={handleChange} 
                  placeholder="Ej. Perez"
                  className={`w-full border rounded-lg p-2 focus:ring-2 focus:outline-none ${errores.primerApellido ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-red-500'}`} 
                />
                {errores.primerApellido && <p className="text-red-500 text-xs mt-1">{errores.primerApellido}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido</label>
                <input 
                  type="text" 
                  name="segundoApellido" 
                  value={formData.segundoApellido} 
                  onChange={handleChange} 
                  placeholder="Ej. Lopez"
                  className={`w-full border rounded-lg p-2 focus:ring-2 focus:outline-none ${errores.segundoApellido ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-red-500'}`} 
                />
                {errores.segundoApellido && <p className="text-red-500 text-xs mt-1">{errores.segundoApellido}</p>}
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carnet de Identidad (CI) *</label>
                <input 
                  type="text" 
                  name="ci" 
                  value={formData.ci} 
                  onChange={handleChange} 
                  placeholder="Ej. 1234567"
                  className={`w-full border rounded-lg p-2 focus:ring-2 focus:outline-none ${errores.ci ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-red-500'}`} 
                />
                {errores.ci && <p className="text-red-500 text-xs mt-1">{errores.ci}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento *</label>
                <input 
                  type="date" 
                  name="fechaNacimiento" 
                  value={formData.fechaNacimiento} 
                  onChange={handleChange} 
                  className={`w-full border rounded-lg p-2 focus:ring-2 focus:outline-none ${errores.fechaNacimiento ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-red-500'}`} 
                />
                {errores.fechaNacimiento && <p className="text-red-500 text-xs mt-1">{errores.fechaNacimiento}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Género *</label>
                <select 
                  name="genero" 
                  value={formData.genero} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMENINO">Femenino</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                <input 
                  type="text" 
                  name="telefono" 
                  value={formData.telefono} 
                  onChange={handleChange} 
                  placeholder="Ej. 71856967"
                  className={`w-full border rounded-lg p-2 focus:ring-2 focus:outline-none ${errores.telefono ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-red-500'}`} 
                />
                {errores.telefono && <p className="text-red-500 text-xs mt-1">{errores.telefono}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                <input 
                  type="text" 
                  name="direccion" 
                  value={formData.direccion} 
                  onChange={handleChange} 
                  placeholder="Ej. Av. Blanco Galindo Km 5"
                  className={`w-full border rounded-lg p-2 focus:ring-2 focus:outline-none ${errores.direccion ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-red-500'}`} 
                />
                {errores.direccion && <p className="text-red-500 text-xs mt-1">{errores.direccion}</p>}
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Rol *</label>
                <select 
                  name="rolNombre" 
                  value={formData.rolNombre} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  <option value="RECEPCIONISTA">Recepcionista</option>
                  <option value="INSTRUCTOR">Instructor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Sucursal *</label>
                <select 
                  name="sucursalBaseId" 
                  value={formData.sucursalBaseId} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  <option value="1">1 - Sede Norte</option>
                  <option value="2">2 - Sede Sur</option>
                  <option value="3">3 - Sede Este</option>
                  <option value="4">4 - Sede Oeste</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Salario Fijo (Bs)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  name="salarioFijo" 
                  value={formData.salarioFijo} 
                  onChange={handleChange} 
                  placeholder="Ej. 3350" 
                  className={`w-full border rounded-lg p-2 focus:ring-2 focus:outline-none ${errores.salarioFijo ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-red-500'}`} 
                />
                {errores.salarioFijo && <p className="text-red-500 text-xs mt-1">{errores.salarioFijo}</p>}
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={handleClose} 
            disabled={loading} 
            className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            form="formEmpleado" 
            disabled={loading} 
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
          >
            <Save size={20} />
            {loading ? 'Guardando...' : 'Registrar Empleado'}
          </button>
        </div>

      </div>
    </div>
  );
}