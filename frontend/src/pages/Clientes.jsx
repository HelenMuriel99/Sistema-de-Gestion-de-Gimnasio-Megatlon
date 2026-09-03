import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Search, Plus, Edit, Trash2, AlertTriangle, 
  UserPlus, X, CheckCircle, Save, ShieldAlert
} from 'lucide-react';

export default function Clientes() {
  // Estados para la lista y cargas
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para Modales
  const [modalNuevoOpen, setModalNuevoOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  
  // Estado para la ventana de Éxito al crear
  const [clienteCreadoInfo, setClienteCreadoInfo] = useState(null);

  // Estado del formulario de creación
  const estadoInicialForm = {
    ci: '', primerNombre: '', segundoNombre: '', primerApellido: '', 
    segundoApellido: '', fechaNacimiento: '', genero: 'MASCULINO', 
    telefono: '', direccion: ''
  };
  const [nuevoCliente, setNuevoCliente] = useState(estadoInicialForm);
  const [clienteAEditar, setClienteAEditar] = useState(estadoInicialForm);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/recepcionista/consultas/clientes');
      setClientes(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los clientes. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  const handleCrearCliente = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      // Llamamos al endpoint que hizo Fabrizzio
      await api.post('/recepcionista/clientes', nuevoCliente);
      cargarClientes();
      
      // En vez de cerrar el modal, mostramos la info de éxito (El backend usa el CI como clave por defecto)
      setClienteCreadoInfo({ 
        ci: nuevoCliente.ci, 
        nombre: `${nuevoCliente.primerNombre} ${nuevoCliente.primerApellido}` 
      });
      
      // Limpiamos el formulario por detrás para la próxima vez
      setNuevoCliente(estadoInicialForm);
    } catch (err) {
      alert("Error al registrar: " + (err.response?.data?.message || err.message));
    } finally {
      setGuardando(false);
    }
  };

  const handleEditarCliente = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await api.put(`/recepcionista/gestion/clientes/${clienteAEditar.ci}`, clienteAEditar);
      cargarClientes();
      setModalEditarOpen(false);
    } catch (err) {
      alert("Error al actualizar: " + (err.response?.data?.message || err.message));
    } finally {
      setGuardando(false);
    }
  };

  const handleDesactivarCliente = async () => {
    if (!clienteAEliminar) return;
    setGuardando(true);
    try {
      await api.delete(`/recepcionista/gestion/clientes/${clienteAEliminar.ci}`);
      setClienteAEliminar(null);
      cargarClientes();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al desactivar cliente');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Clientes</h1>
          <p className="text-gray-500 mt-1">Inscribe personas, actualiza sus datos y administra su acceso.</p>
        </div>
        <button 
          onClick={() => {
            setClienteCreadoInfo(null);
            setModalNuevoOpen(true);
          }}
          className="flex items-center gap-2 bg-megatlon-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Inscribir Cliente
        </button>
      </div>

      {/* Tarjeta con la Tabla */}
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
                    <td className="px-6 py-4 font-mono text-gray-500">{cli.ci}</td>
                    <td className="px-6 py-4">{cli.telefono}</td>
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
                          setModalEditarOpen(true);
                        }} 
                        className="text-blue-500 hover:text-blue-700 p-1 mx-1 transition-colors" 
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      
                      {cli.estadoAcceso === 'INACTIVO' ? (
                        <button onClick={() => alert("Reactivar cliente: Pendiente de endpoint en Backend")} className="text-green-500 hover:text-green-700 p-1 mx-1 transition-colors" title="Reactivar">
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
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No hay clientes inscritos en esta sucursal.</td></tr>
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
              }}><X className="text-gray-400 hover:text-gray-600"/></button>
            </div>

            {/* Si el cliente se creó, mostramos la pantalla de éxito. Si no, el formulario */}
            {clienteCreadoInfo ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">¡Inscripción Exitosa!</h3>
                <p className="text-gray-600">El cliente <strong>{clienteCreadoInfo.nombre}</strong> ha sido registrado.</p>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-4 inline-block text-left shadow-sm">
                  <p className="text-sm text-gray-500 mb-3 font-medium">Credenciales de acceso para la App del Cliente:</p>
                  <p className="font-mono text-lg text-gray-800 mb-1"><strong>Usuario (CI):</strong> {clienteCreadoInfo.ci}</p>
                  <p className="font-mono text-lg text-megatlon-primary"><strong>Contraseña:</strong> {clienteCreadoInfo.ci}</p>
                  <p className="text-xs text-red-500 mt-3 font-medium italic">* Por política del gimnasio, su CI es la contraseña por defecto.</p>
                </div>
                
                <div className="pt-6">
                  <button 
                    onClick={() => {
                      setModalNuevoOpen(false);
                      setClienteCreadoInfo(null);
                    }} 
                    className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-2 rounded-lg font-medium transition-colors"
                  >
                    Entendido, Cerrar
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCrearCliente} className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">CI *</label><input className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-megatlon-primary" value={nuevoCliente.ci} onChange={e => setNuevoCliente({...nuevoCliente, ci: e.target.value})} required/></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Fecha Nacimiento *</label><input type="date" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-megatlon-primary" value={nuevoCliente.fechaNacimiento} onChange={e => setNuevoCliente({...nuevoCliente, fechaNacimiento: e.target.value})} required/></div>
                  
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Primer Nombre *</label><input className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-megatlon-primary" value={nuevoCliente.primerNombre} onChange={e => setNuevoCliente({...nuevoCliente, primerNombre: e.target.value})} required/></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Segundo Nombre</label><input className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-megatlon-primary" value={nuevoCliente.segundoNombre} onChange={e => setNuevoCliente({...nuevoCliente, segundoNombre: e.target.value})}/></div>
                  
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido *</label><input className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-megatlon-primary" value={nuevoCliente.primerApellido} onChange={e => setNuevoCliente({...nuevoCliente, primerApellido: e.target.value})} required/></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido</label><input className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-megatlon-primary" value={nuevoCliente.segundoApellido} onChange={e => setNuevoCliente({...nuevoCliente, segundoApellido: e.target.value})}/></div>
                  
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label><input className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-megatlon-primary" value={nuevoCliente.telefono} onChange={e => setNuevoCliente({...nuevoCliente, telefono: e.target.value})} required/></div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Género *</label>
                    <select className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-megatlon-primary" value={nuevoCliente.genero} onChange={e => setNuevoCliente({...nuevoCliente, genero: e.target.value})}>
                      <option value="MASCULINO">Masculino</option><option value="FEMENINO">Femenino</option><option value="OTRO">Otro</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label><input className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-megatlon-primary" value={nuevoCliente.direccion} onChange={e => setNuevoCliente({...nuevoCliente, direccion: e.target.value})} required/></div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setModalNuevoOpen(false)} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Cancelar</button>
                  <button type="submit" disabled={guardando} className="px-6 py-2 bg-megatlon-primary hover:bg-red-700 text-white rounded flex items-center gap-2 disabled:opacity-50">
                    <Save size={18}/> {guardando ? 'Guardando...' : 'Registrar Cliente'}
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
                <Edit className="text-blue-500"/> Editar Cliente: {clienteAEditar.ci}
              </h2>
              <button onClick={() => setModalEditarOpen(false)}><X className="text-gray-400 hover:text-gray-600"/></button>
            </div>
            <form onSubmit={handleEditarCliente} className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Primer Nombre *</label><input className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" value={clienteAEditar.primerNombre} onChange={e => setClienteAEditar({...clienteAEditar, primerNombre: e.target.value})} required/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Segundo Nombre</label><input className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" value={clienteAEditar.segundoNombre || ''} onChange={e => setClienteAEditar({...clienteAEditar, segundoNombre: e.target.value})}/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido *</label><input className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" value={clienteAEditar.primerApellido} onChange={e => setClienteAEditar({...clienteAEditar, primerApellido: e.target.value})} required/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido</label><input className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" value={clienteAEditar.segundoApellido || ''} onChange={e => setClienteAEditar({...clienteAEditar, segundoApellido: e.target.value})}/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label><input className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" value={clienteAEditar.telefono} onChange={e => setClienteAEditar({...clienteAEditar, telefono: e.target.value})} required/></div>
                <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label><input className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" value={clienteAEditar.direccion} onChange={e => setClienteAEditar({...clienteAEditar, direccion: e.target.value})} required/></div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setModalEditarOpen(false)} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Cancelar</button>
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