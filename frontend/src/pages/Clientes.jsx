import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  Search, Plus, Edit, Trash2, AlertTriangle, 
  UserPlus, X, CheckCircle, Save, ShieldAlert, AlertCircle
} from 'lucide-react';

export default function Clientes() {
  const { user } = useContext(AuthContext);

  const [clientes, setClientes] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [diagnostico, setDiagnostico] = useState(""); 

  const [modalNuevoOpen, setModalNuevoOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [clienteCreadoInfo, setClienteCreadoInfo] = useState(null);

  const estadoInicialForm = {
    ci: '', complementoCi: '', primerNombre: '', segundoNombre: '', primerApellido: '', 
    segundoApellido: '', fechaNacimiento: '', genero: 'MASCULINO', 
    telefono: '', direccion: '', sucursalId: '1',
    planId: '', disciplinaId: ''
  };
  const [nuevoCliente, setNuevoCliente] = useState(estadoInicialForm);
  const [clienteAEditar, setClienteAEditar] = useState(estadoInicialForm);
  const [errores, setErrores] = useState({});
  const [apiErrorCliente, setApiErrorCliente] = useState(null);
  const [erroresEditar, setErroresEditar] = useState({});
  const [apiErrorEditar, setApiErrorEditar] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      setDiagnostico("");
      
      // 1. Cargar Clientes
      const endpointClientes = user.rol === 'PROPIETARIO' 
        ? '/propietario/consultas/usuarios?rol=CLIENTE' 
        : '/recepcionista/consultas/clientes';
      
      const resClientes = await api.get(endpointClientes);
      setClientes(resClientes.data);

      // 2. Cargar Catálogo de Planes y Disciplinas (Rutas separadas por Rol)
      try {
        const baseCatUrl = user.rol === 'PROPIETARIO' 
          ? '/propietario/catalogo' 
          : '/recepcionista/catalogo';
          
        const resPlanes = await api.get(`${baseCatUrl}/planes`);
        const resDisciplinas = await api.get(`${baseCatUrl}/disciplinas`);
        
        setPlanes(resPlanes.data);
        setDisciplinas(resDisciplinas.data);

      } catch (catErr) {
        console.error("Error del catálogo:", catErr);
        if (catErr.response && catErr.response.status === 403) {
          setDiagnostico("Error 403: Sin acceso al Catálogo de Planes.");
        }
      }

    } catch (err) {
      console.error("Error cargando clientes:", err);
      setError("No se pudieron cargar los datos de la tabla. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  // Filtro compartido para los inputs con nombre (name) del formulario de Inscribir Cliente
  const handleChangeNuevoCliente = (e) => {
    const { name, value } = e.target;
    let valorLimpio = value;

    if (name === 'ci') {
      valorLimpio = value.replace(/\D/g, '').slice(0, 10); // Solo números, máx 10 dígitos
    } else if (name === 'telefono') {
      valorLimpio = value.replace(/\D/g, '').slice(0, 8); // Solo números, máx 8 dígitos
    } else if (name === 'complementoCi') {
      valorLimpio = value.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase(); // Solo letras, máx 2, mayúsculas
    } else if (name === 'primerNombre' || name === 'segundoNombre' || name === 'primerApellido' || name === 'segundoApellido') {
      valorLimpio = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); // Solo letras
    }

    setNuevoCliente(prev => ({ ...prev, [name]: valorLimpio }));

    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: null }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (!nuevoCliente.primerNombre.trim()) nuevosErrores.primerNombre = 'Obligatorio';
    else if (!soloLetras.test(nuevoCliente.primerNombre)) nuevosErrores.primerNombre = 'Solo letras';

    if (!nuevoCliente.primerApellido.trim()) nuevosErrores.primerApellido = 'Obligatorio';
    else if (!soloLetras.test(nuevoCliente.primerApellido)) nuevosErrores.primerApellido = 'Solo letras';

    if (!nuevoCliente.ci) nuevosErrores.ci = 'Obligatorio';
    else if (!/^\d{5,10}$/.test(nuevoCliente.ci)) nuevosErrores.ci = 'Debe tener entre 5 y 10 dígitos';

    if (!nuevoCliente.telefono) nuevosErrores.telefono = 'Obligatorio';
    else if (!/^[467]\d{7}$/.test(nuevoCliente.telefono)) nuevosErrores.telefono = 'Ingrese un número válido de 8 dígitos';

    if (!nuevoCliente.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = 'Obligatoria';
    } else {
      const fechaNac = new Date(nuevoCliente.fechaNacimiento);
      const hoy = new Date();
      if (fechaNac > hoy) nuevosErrores.fechaNacimiento = 'No puede ser fecha futura';
      else {
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        if (edad < 14) nuevosErrores.fechaNacimiento = 'Debe ser mayor de 14 años';
      }
    }

    if (!nuevoCliente.direccion.trim()) nuevosErrores.direccion = 'Obligatoria';
    if (!nuevoCliente.planId) nuevosErrores.planId = 'Seleccione un plan';

    const planSeleccionado = planes.find(p => p.id === parseInt(nuevoCliente.planId));
    if (planSeleccionado?.tipoPlan === 'ESPECIFICO' && !nuevoCliente.disciplinaId) {
      nuevosErrores.disciplinaId = 'Seleccione la disciplina';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Traduce un error 409 del backend (CI o teléfono duplicado) a un mensaje claro
  const interpretarErrorGuardado = (err) => {
    const status = err.response?.status;
    const serverMessage = err.response?.data?.message || '';
    const msgLower = typeof serverMessage === 'string' ? serverMessage.toLowerCase() : '';

    if (status === 409 && (msgLower.includes('telefono') || msgLower.includes('teléfono'))) {
      return 'Ya hay un cliente registrado con ese número de teléfono.';
    }
    if (status === 409 && msgLower.includes('ci')) {
      return 'Ya existe un usuario registrado con este Carnet de Identidad (CI).';
    }
    if (status === 409 && serverMessage) {
      return serverMessage;
    }
    if (status === 403) {
      return 'No tienes permisos para realizar esta acción.';
    }
    if (status === 401) {
      return 'Tu sesión expiró o no es válida. Vuelve a iniciar sesión.';
    }
    if (serverMessage) {
      return serverMessage;
    }
    return 'Error al guardar el cliente. Revisa la conexión o tus permisos.';
  };

  const handleCrearCliente = async (e) => {
    e.preventDefault();
    setApiErrorCliente(null);
    if (!validarFormulario()) return;

    setGuardando(true);
    try {
      const endpoint = user.rol === 'PROPIETARIO' 
        ? `/propietario/clientes?sucursalId=${nuevoCliente.sucursalId}` 
        : `/recepcionista/clientes`;

      const payload = {
        ci: nuevoCliente.ci.trim(),
        complementoCi: nuevoCliente.complementoCi?.trim() || null,
        primerNombre: nuevoCliente.primerNombre.trim(),
        segundoNombre: nuevoCliente.segundoNombre.trim() || null,
        primerApellido: nuevoCliente.primerApellido.trim(),
        segundoApellido: nuevoCliente.segundoApellido.trim() || null,
        fechaNacimiento: nuevoCliente.fechaNacimiento,
        genero: nuevoCliente.genero,
        telefono: nuevoCliente.telefono.trim(),
        direccion: nuevoCliente.direccion.trim(),
        planId: parseInt(nuevoCliente.planId),
        disciplinaId: nuevoCliente.disciplinaId ? parseInt(nuevoCliente.disciplinaId) : null
      };

      // Capturamos la respuesta del backend para obtener la password generada
      const response = await api.post(endpoint, payload);
      cargarDatos();
      
      setClienteCreadoInfo({ 
        ci: nuevoCliente.ci, 
        nombre: `${nuevoCliente.primerNombre} ${nuevoCliente.primerApellido}`,
        password: response.data.passwordGeneradaPlana || nuevoCliente.ci // Fallback por si acaso
      });
      
      setNuevoCliente(estadoInicialForm);
      setErrores({});
    } catch (err) {
      console.error("Error al registrar:", err.response || err);
      setApiErrorCliente(interpretarErrorGuardado(err));
    } finally {
      setGuardando(false);
    }
  };

  const handleEditarCliente = async (e) => {
    e.preventDefault();
    setApiErrorEditar(null);

    if (clienteAEditar.telefono && !/^[467]\d{7}$/.test(clienteAEditar.telefono)) {
      setErroresEditar({ telefono: 'Ingrese un número válido de 8 dígitos' });
      return;
    }
    setErroresEditar({});

    setGuardando(true);
    try {
      const endpoint = user.rol === 'PROPIETARIO'
        ? `/propietario/gestion/usuarios/${clienteAEditar.ci}`
        : `/recepcionista/gestion/clientes/${clienteAEditar.ci}`;

      const payload = {
        complementoCi: clienteAEditar.complementoCi?.trim() || null,
        primerNombre: clienteAEditar.primerNombre,
        segundoNombre: clienteAEditar.segundoNombre,
        primerApellido: clienteAEditar.primerApellido,
        segundoApellido: clienteAEditar.segundoApellido,
        telefono: clienteAEditar.telefono,
        direccion: clienteAEditar.direccion
      };

      await api.put(endpoint, payload);
      cargarDatos();
      setModalEditarOpen(false);
    } catch (err) {
      setApiErrorEditar(interpretarErrorGuardado(err));
    } finally {
      setGuardando(false);
    }
  };

  const handleDesactivarCliente = async () => {
    if (!clienteAEliminar) return;
    setGuardando(true);
    try {
      const endpoint = user.rol === 'PROPIETARIO'
        ? `/propietario/gestion/usuarios/${clienteAEliminar.ci}`
        : `/recepcionista/gestion/clientes/${clienteAEliminar.ci}`;

      await api.delete(endpoint);
      setClienteAEliminar(null);
      cargarDatos();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al desactivar cliente');
    } finally {
      setGuardando(false);
    }
  };

  const planSeleccionadoObj = planes.find(p => p.id === parseInt(nuevoCliente.planId));
  const requiereDisciplina = planSeleccionadoObj?.tipoPlan === 'ESPECIFICO';

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Clientes</h1>
          <p className="text-gray-500 mt-1">Inscribe personas, actualiza sus datos y administra su acceso.</p>
        </div>
        <button 
          onClick={() => {
            setErrores({});
            setApiErrorCliente(null);
            setClienteCreadoInfo(null);
            setModalNuevoOpen(true);
          }}
          className="flex items-center gap-2 bg-megatlon-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Inscribir Cliente
        </button>
      </div>

      {diagnostico && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-sm flex items-start gap-3">
          <AlertCircle className="text-yellow-500 mt-0.5" size={20} />
          <p className="text-yellow-800 font-medium text-sm">{diagnostico}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Buscar cliente..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-megatlon-primary focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        {loading && <div className="p-8 text-center text-gray-500">Cargando clientes...</div>}
        {error && <div className="p-8 text-center text-red-500 flex flex-col items-center"><ShieldAlert size={48} className="mb-2 opacity-50"/>{error}</div>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">CI / Usuario</th>
                  <th className="px-6 py-4">Teléfono</th>
                  <th className="px-6 py-4">Plan Actual</th>
                  {user?.rol === 'PROPIETARIO' && <th className="px-6 py-4">Sucursal</th>}
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clientes.map((cli) => (
                  <tr key={cli.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{cli.nombreCompleto}</div>
                      <div className="text-xs text-gray-400">{cli.direccion}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-500">
                      {cli.ci}{cli.complementoCi && <span className="text-gray-400"> - {cli.complementoCi}</span>}
                    </td>
                    <td className="px-6 py-4">{cli.telefono}</td>
                    
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {cli.planNombre ? (
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-100">
                          {cli.planNombre}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-xs">Sin plan</span>
                      )}
                    </td>

                    {user?.rol === 'PROPIETARIO' && (
                      <td className="px-6 py-4 font-medium text-gray-600">{cli.sucursalNombre}</td>
                    )}

                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1 font-medium ${cli.estadoAcceso === 'ACTIVO' ? 'text-green-600' : 'text-red-500'}`}>
                        <div className={`w-2 h-2 rounded-full ${cli.estadoAcceso === 'ACTIVO' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        {cli.estadoAcceso}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          setClienteAEditar(cli);
                          setErroresEditar({});
                          setApiErrorEditar(null);
                          setModalEditarOpen(true);
                        }} 
                        className="text-blue-500 hover:text-blue-700 p-1 mx-1 transition-colors" 
                        title="Editar Contacto"
                      >
                        <Edit size={18} />
                      </button>
                      
                      {cli.estadoAcceso === 'INACTIVO' ? (
                        <button onClick={() => alert("Pendiente de endpoint de reactivación")} className="text-green-500 hover:text-green-700 p-1 mx-1 transition-colors" title="Reactivar">
                          <CheckCircle size={18} />
                        </button>
                      ) : (
                        <button onClick={() => setClienteAEliminar(cli)} className="text-red-500 hover:text-red-700 p-1 mx-1 transition-colors" title="Dar de baja">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {clientes.length === 0 && (
                  <tr><td colSpan={user?.rol === 'PROPIETARIO' ? "7" : "6"} className="px-6 py-8 text-center text-gray-500">No hay clientes inscritos.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalNuevoOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <UserPlus className="text-megatlon-primary"/> Inscribir Cliente
              </h2>
              <button onClick={() => {
                setModalNuevoOpen(false);
                setClienteCreadoInfo(null);
                setNuevoCliente(estadoInicialForm);
                setErrores({});
                setApiErrorCliente(null);
              }}><X className="text-gray-400 hover:text-gray-600"/></button>
            </div>

            {clienteCreadoInfo ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">¡Inscripción Exitosa!</h3>
                <p className="text-gray-600">El cliente <strong>{clienteCreadoInfo.nombre}</strong> ha sido registrado y su membresía está activa.</p>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-4 inline-block text-left shadow-sm">
                  <p className="text-sm text-gray-500 mb-3 font-medium">Credenciales de la App:</p>
                  <p className="font-mono text-lg text-gray-800 mb-1"><strong>Usuario:</strong> {clienteCreadoInfo.ci}</p>
                  {/* Aquí inyectamos la contraseña generada dinámicamente por el Backend */}
                  <p className="font-mono text-lg text-megatlon-primary"><strong>Contraseña:</strong> {clienteCreadoInfo.password}</p>
                </div>
                
                <div className="pt-6">
                  <button 
                    onClick={() => {
                      setModalNuevoOpen(false);
                      setClienteCreadoInfo(null);
                    }} 
                    className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-2 rounded-lg font-medium transition-colors"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCrearCliente} className="p-6 overflow-y-auto max-h-[70vh] space-y-6" noValidate>
                
                {apiErrorCliente && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
                    <AlertCircle className="mt-0.5 shrink-0" size={18} />
                    <p className="text-sm font-medium">{apiErrorCliente}</p>
                  </div>
                )}

                <h3 className="font-bold text-gray-700 border-b pb-2">Datos Personales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div>
                    <div className="flex gap-2">
                      <div className="w-2/3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">CI *</label>
                        <input 
                          name="ci"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={10}
                          className={`w-full p-2 border rounded focus:ring-2 focus:outline-none ${errores.ci ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-megatlon-primary'}`}
                          value={nuevoCliente.ci}
                          onChange={handleChangeNuevoCliente}
                          placeholder="Ej. 1234567"
                        />
                      </div>
                      <div className="w-1/3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                        <input
                          name="complementoCi"
                          type="text"
                          placeholder="Ej. AB"
                          title="Complemento"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-megatlon-primary text-center"
                          value={nuevoCliente.complementoCi}
                          onChange={handleChangeNuevoCliente}
                        />
                      </div>
                    </div>
                    {errores.ci && <p className="text-red-500 text-xs mt-1">{errores.ci}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Nacimiento *</label>
                    <input type="date" name="fechaNacimiento" className={`w-full p-2 border rounded focus:ring-2 focus:outline-none ${errores.fechaNacimiento ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-megatlon-primary'}`} value={nuevoCliente.fechaNacimiento} onChange={handleChangeNuevoCliente}/>
                    {errores.fechaNacimiento && <p className="text-red-500 text-xs mt-1">{errores.fechaNacimiento}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primer Nombre *</label>
                    <input name="primerNombre" className={`w-full p-2 border rounded focus:ring-2 focus:outline-none ${errores.primerNombre ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-megatlon-primary'}`} value={nuevoCliente.primerNombre} onChange={handleChangeNuevoCliente}/>
                    {errores.primerNombre && <p className="text-red-500 text-xs mt-1">{errores.primerNombre}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Nombre</label>
                    <input name="segundoNombre" className={`w-full p-2 border rounded focus:ring-2 focus:outline-none ${errores.segundoNombre ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-megatlon-primary'}`} value={nuevoCliente.segundoNombre} onChange={handleChangeNuevoCliente}/>
                    {errores.segundoNombre && <p className="text-red-500 text-xs mt-1">{errores.segundoNombre}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido *</label>
                    <input name="primerApellido" className={`w-full p-2 border rounded focus:ring-2 focus:outline-none ${errores.primerApellido ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-megatlon-primary'}`} value={nuevoCliente.primerApellido} onChange={handleChangeNuevoCliente}/>
                    {errores.primerApellido && <p className="text-red-500 text-xs mt-1">{errores.primerApellido}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido</label>
                    <input name="segundoApellido" className={`w-full p-2 border rounded focus:ring-2 focus:outline-none ${errores.segundoApellido ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-megatlon-primary'}`} value={nuevoCliente.segundoApellido} onChange={handleChangeNuevoCliente}/>
                    {errores.segundoApellido && <p className="text-red-500 text-xs mt-1">{errores.segundoApellido}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                    <input name="telefono" inputMode="numeric" pattern="[0-9]*" maxLength={8} className={`w-full p-2 border rounded focus:ring-2 focus:outline-none ${errores.telefono ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-megatlon-primary'}`} value={nuevoCliente.telefono} onChange={handleChangeNuevoCliente} placeholder="Ej. 71800000"/>
                    {errores.telefono && <p className="text-red-500 text-xs mt-1">{errores.telefono}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Género *</label>
                    <select name="genero" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-megatlon-primary outline-none" value={nuevoCliente.genero} onChange={handleChangeNuevoCliente}>
                      <option value="MASCULINO">Masculino</option><option value="FEMENINO">Femenino</option><option value="OTRO">Otro</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                    <input name="direccion" className={`w-full p-2 border rounded focus:ring-2 focus:outline-none ${errores.direccion ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-megatlon-primary'}`} value={nuevoCliente.direccion} onChange={handleChangeNuevoCliente}/>
                    {errores.direccion && <p className="text-red-500 text-xs mt-1">{errores.direccion}</p>}
                  </div>
                </div>

                <h3 className="font-bold text-gray-700 border-b pb-2 pt-4">Plan de Membresía Inicial</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 border border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-sm font-bold text-megatlon-primary mb-1">Seleccionar Plan *</label>
                    <select 
                      name="planId"
                      className={`w-full p-2 border rounded bg-white focus:ring-2 focus:outline-none ${errores.planId ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-megatlon-primary'}`}
                      value={nuevoCliente.planId} 
                      onChange={e => {
                        setNuevoCliente({...nuevoCliente, planId: e.target.value, disciplinaId: ''});
                        if (errores.planId) setErrores(prev => ({...prev, planId: null}));
                      }}
                    >
                      <option value="">-- Elige un Plan --</option>
                      {planes.map(p => (
                        <option key={p.id} value={p.id}>{p.nombre} (Bs. {p.precio})</option>
                      ))}
                    </select>
                    {errores.planId && <p className="text-red-500 text-xs mt-1">{errores.planId}</p>}
                  </div>

                  {requiereDisciplina && (
                    <div>
                      <label className="block text-sm font-bold text-megatlon-primary mb-1">Seleccionar Disciplina *</label>
                      <select 
                        name="disciplinaId"
                        className={`w-full p-2 border rounded bg-white focus:ring-2 focus:outline-none ${errores.disciplinaId ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-megatlon-primary'}`}
                        value={nuevoCliente.disciplinaId} 
                        onChange={e => {
                          setNuevoCliente({...nuevoCliente, disciplinaId: e.target.value});
                          if (errores.disciplinaId) setErrores(prev => ({...prev, disciplinaId: null}));
                        }}
                      >
                        <option value="">-- Elige la Disciplina --</option>
                        {disciplinas.map(d => (
                          <option key={d.id} value={d.id}>{d.nombre}</option>
                        ))}
                      </select>
                      {errores.disciplinaId && <p className="text-red-500 text-xs mt-1">{errores.disciplinaId}</p>}
                    </div>
                  )}

                  {user?.rol === 'PROPIETARIO' && (
                    <div className="md:col-span-2 mt-2">
                      <label className="block text-sm font-bold text-gray-800 mb-1">Asignar a Sucursal *</label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-megatlon-primary outline-none" 
                        value={nuevoCliente.sucursalId} 
                        onChange={e => setNuevoCliente({...nuevoCliente, sucursalId: e.target.value})}
                      >
                        <option value="1">1 - Sede Norte</option>
                        <option value="2">2 - Sede Sur</option>
                        <option value="3">3 - Sede Este</option>
                        <option value="4">4 - Sede Oeste</option>
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => { setModalNuevoOpen(false); setErrores({}); setApiErrorCliente(null); }} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Cancelar</button>
                  <button type="submit" disabled={guardando} className="px-6 py-2 bg-megatlon-primary hover:bg-red-700 text-white rounded flex items-center gap-2 disabled:opacity-50">
                    <Save size={18}/> {guardando ? 'Guardando...' : 'Inscribir y Vender Plan'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {modalEditarOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Edit className="text-blue-500"/> Editar Contacto: {clienteAEditar.ci}
              </h2>
              <button onClick={() => { setModalEditarOpen(false); setErroresEditar({}); setApiErrorEditar(null); }}><X className="text-gray-400 hover:text-gray-600"/></button>
            </div>
            <form onSubmit={handleEditarCliente} className="p-6 overflow-y-auto max-h-[70vh] space-y-4">
              {apiErrorEditar && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
                  <AlertCircle className="mt-0.5 shrink-0" size={18} />
                  <p className="text-sm font-medium">{apiErrorEditar}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Primer Nombre *</label><input className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={clienteAEditar.primerNombre} onChange={e => setClienteAEditar({...clienteAEditar, primerNombre: e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')})} required/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Segundo Nombre</label><input className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={clienteAEditar.segundoNombre || ''} onChange={e => setClienteAEditar({...clienteAEditar, segundoNombre: e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')})}/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido *</label><input className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={clienteAEditar.primerApellido} onChange={e => setClienteAEditar({...clienteAEditar, primerApellido: e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')})} required/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido</label><input className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={clienteAEditar.segundoApellido || ''} onChange={e => setClienteAEditar({...clienteAEditar, segundoApellido: e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')})}/></div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                  <input
                    type="text"
                    placeholder="Ej. AB"
                    title="Complemento"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-center"
                    value={clienteAEditar.complementoCi || ''}
                    onChange={e => setClienteAEditar({...clienteAEditar, complementoCi: e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase()})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={8}
                    className={`w-full p-2 border rounded focus:ring-2 focus:outline-none ${erroresEditar.telefono ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
                    value={clienteAEditar.telefono}
                    onChange={e => setClienteAEditar({...clienteAEditar, telefono: e.target.value.replace(/\D/g, '').slice(0, 8)})}
                    required
                  />
                  {erroresEditar.telefono && <p className="text-red-500 text-xs mt-1">{erroresEditar.telefono}</p>}
                </div>
                <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label><input className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={clienteAEditar.direccion} onChange={e => setClienteAEditar({...clienteAEditar, direccion: e.target.value})} required/></div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => { setModalEditarOpen(false); setErroresEditar({}); setApiErrorEditar(null); }} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Cancelar</button>
                <button type="submit" disabled={guardando} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-2 disabled:opacity-50">
                  <Save size={18}/> {guardando ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {clienteAEliminar && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden text-center p-6">
            <div className="mx-auto w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">¿Dar de baja?</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Estás a punto de desactivar a <strong>{clienteAEliminar.nombreCompleto}</strong>. Ya no podrá ingresar con su App.
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setClienteAEliminar(null)} disabled={guardando} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-lg">
                Cancelar
              </button>
              <button onClick={handleDesactivarCliente} disabled={guardando} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg disabled:opacity-50">
                {guardando ? 'Procesando...' : 'Sí, Desactivar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}