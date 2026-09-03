import { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Plus, Edit, UserX, Activity, CheckCircle, AlertTriangle, X, Save, UserPlus } from 'lucide-react';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para modales
  const [modalNuevoOpen, setModalNuevoOpen] = useState(false);
  const [clienteAEditar, setClienteAEditar] = useState(null);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [procesandoBaja, setProcesandoBaja] = useState(false);

  // Nuevo estado para el formulario de registrar
  const [nuevoCliente, setNuevoCliente] = useState({
    ci: '', primerNombre: '', segundoNombre: '', primerApellido: '', 
    segundoApellido: '', fechaNacimiento: '', genero: 'MASCULINO', 
    telefono: '', direccion: ''
  });
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
      if (err.response?.status === 403) {
        setError("Acceso denegado. Solo las RECEPCIONISTAS pueden gestionar clientes.");
      } else {
        setError("Error al cargar clientes. ¿Está el backend encendido?");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDesactivar = async () => {
    if (!clienteAEliminar) return;
    setProcesandoBaja(true);
    try {
      await api.delete(`/recepcionista/gestion/clientes/${clienteAEliminar.ci}`);
      setClienteAEliminar(null);
      cargarClientes();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al desactivar cliente');
    } finally {
      setProcesandoBaja(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Clientes</h1>
          <p className="text-gray-500 mt-1">Inscribe nuevos clientes, asigna planes y controla accesos.</p>
        </div>
        <button 
          onClick={() => setModalNuevoOpen(true)}
          className="flex items-center gap-2 bg-megatlon-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Inscribir Cliente
        </button>
      </div>

      {/* Tarjeta principal */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Barra de herramientas */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Buscar por nombre o CI..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-megatlon-primary focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        {loading && <div className="p-8 text-center text-gray-500 font-medium">Cargando clientes...</div>}
        
        {error && (
          <div className="p-8 text-center text-red-500 bg-red-50 m-4 rounded-lg border border-red-100">
            <p className="font-bold">{error}</p>
          </div>
        )}

        {/* Tabla de Clientes */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">CI</th>
                  <th className="px-6 py-4">Plan Actual</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clientes.map((cli) => (
                  <tr key={cli.id || cli.ci} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{cli.nombreCompleto || `${cli.primerNombre} ${cli.primerApellido}`}</div>
                      <div className="text-xs text-gray-400">{cli.telefono}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-500">{cli.ci}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-400 italic">Sin plan asignado</span>
                    </td>
                    <td className="px-6 py-4">
                      {cli.estadoAcceso === 'ACTIVO' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">ACTIVO</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">{cli.estadoAcceso}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setClienteAEditar(cli)} className="text-blue-500 hover:text-blue-700 p-1 mx-1" title="Editar Perfil">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => alert("Esperando backend de Membresías...")} className="text-green-500 hover:text-green-700 p-1 mx-1" title="Vender Plan">
                        <Activity size={18} />
                      </button>
                      
                      {cli.estadoAcceso === 'INACTIVO' ? (
                        <button onClick={() => alert("Falta el endpoint de Reactivar")} className="text-gray-400 hover:text-green-500 p-1 mx-1" title="Reactivar">
                          <CheckCircle size={18} />
                        </button>
                      ) : (
                        <button onClick={() => setClienteAEliminar(cli)} className="text-red-500 hover:text-red-700 p-1 mx-1" title="Dar de baja">
                          <UserX size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {clientes.length === 0 && (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No hay clientes registrados aún.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Nueva Inscripción (Integrado) */}
      {modalNuevoOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold flex items-center gap-2"><UserPlus className="text-megatlon-primary"/> Inscribir Cliente</h2>
              <button onClick={() => setModalNuevoOpen(false)}><X className="text-gray-400 hover:text-gray-600"/></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setGuardando(true);
              try {
                // Llamamos al nuevo endpoint que hizo Fabrizzio
                await api.post('/recepcionista/clientes', nuevoCliente);
                setModalNuevoOpen(false);
                cargarClientes();
                
                // Limpiamos el formulario para el siguiente registro
                setNuevoCliente({
                  ci: '', primerNombre: '', segundoNombre: '', primerApellido: '', 
                  segundoApellido: '', fechaNacimiento: '', genero: 'MASCULINO', 
                  telefono: '', direccion: ''
                });
                alert("¡Cliente registrado con éxito! Su contraseña por defecto es su propio CI.");
              } catch (err) {
                alert("Error al registrar: " + (err.response?.data?.message || err.message));
              } finally {
                setGuardando(false);
              }
            }} className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm mb-1">CI *</label><input className="w-full p-2 border rounded" value={nuevoCliente.ci} onChange={e => setNuevoCliente({...nuevoCliente, ci: e.target.value})} required/></div>
                <div><label className="block text-sm mb-1">Fecha Nacimiento *</label><input type="date" className="w-full p-2 border rounded" value={nuevoCliente.fechaNacimiento} onChange={e => setNuevoCliente({...nuevoCliente, fechaNacimiento: e.target.value})} required/></div>
                <div><label className="block text-sm mb-1">Primer Nombre *</label><input className="w-full p-2 border rounded" value={nuevoCliente.primerNombre} onChange={e => setNuevoCliente({...nuevoCliente, primerNombre: e.target.value})} required/></div>
                <div><label className="block text-sm mb-1">Segundo Nombre</label><input className="w-full p-2 border rounded" value={nuevoCliente.segundoNombre} onChange={e => setNuevoCliente({...nuevoCliente, segundoNombre: e.target.value})}/></div>
                <div><label className="block text-sm mb-1">Primer Apellido *</label><input className="w-full p-2 border rounded" value={nuevoCliente.primerApellido} onChange={e => setNuevoCliente({...nuevoCliente, primerApellido: e.target.value})} required/></div>
                <div><label className="block text-sm mb-1">Segundo Apellido</label><input className="w-full p-2 border rounded" value={nuevoCliente.segundoApellido} onChange={e => setNuevoCliente({...nuevoCliente, segundoApellido: e.target.value})}/></div>
                <div><label className="block text-sm mb-1">Teléfono *</label><input className="w-full p-2 border rounded" value={nuevoCliente.telefono} onChange={e => setNuevoCliente({...nuevoCliente, telefono: e.target.value})} required/></div>
                <div>
                  <label className="block text-sm mb-1">Género *</label>
                  <select className="w-full p-2 border rounded bg-white" value={nuevoCliente.genero} onChange={e => setNuevoCliente({...nuevoCliente, genero: e.target.value})}>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMENINO">Femenino</option>
                  </select>
                </div>
                <div className="md:col-span-2"><label className="block text-sm mb-1">Dirección *</label><input className="w-full p-2 border rounded" value={nuevoCliente.direccion} onChange={e => setNuevoCliente({...nuevoCliente, direccion: e.target.value})} required/></div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setModalNuevoOpen(false)} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Cancelar</button>
                <button type="submit" disabled={guardando} className="px-6 py-2 bg-megatlon-primary hover:bg-red-700 text-white rounded flex items-center gap-2 disabled:opacity-50">
                  <Save size={18}/> {guardando ? 'Guardando...' : 'Registrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Cliente (Integrado) */}
      {clienteAEditar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold flex items-center gap-2"><Edit className="text-megatlon-primary"/> Editar Cliente: {clienteAEditar.ci}</h2>
              <button onClick={() => setClienteAEditar(null)}><X className="text-gray-400 hover:text-gray-600"/></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await api.put(`/recepcionista/gestion/clientes/${clienteAEditar.ci}`, clienteAEditar);
                setClienteAEditar(null);
                cargarClientes();
              } catch (err) {
                alert("Error al actualizar: " + (err.response?.data?.message || err.message));
              }
            }} className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm mb-1">Primer Nombre</label><input className="w-full p-2 border rounded" value={clienteAEditar.primerNombre || ''} onChange={e => setClienteAEditar({...clienteAEditar, primerNombre: e.target.value})} required/></div>
                <div><label className="block text-sm mb-1">Segundo Nombre</label><input className="w-full p-2 border rounded" value={clienteAEditar.segundoNombre || ''} onChange={e => setClienteAEditar({...clienteAEditar, segundoNombre: e.target.value})}/></div>
                <div><label className="block text-sm mb-1">Primer Apellido</label><input className="w-full p-2 border rounded" value={clienteAEditar.primerApellido || ''} onChange={e => setClienteAEditar({...clienteAEditar, primerApellido: e.target.value})} required/></div>
                <div><label className="block text-sm mb-1">Segundo Apellido</label><input className="w-full p-2 border rounded" value={clienteAEditar.segundoApellido || ''} onChange={e => setClienteAEditar({...clienteAEditar, segundoApellido: e.target.value})}/></div>
                <div><label className="block text-sm mb-1">Teléfono</label><input className="w-full p-2 border rounded" value={clienteAEditar.telefono || ''} onChange={e => setClienteAEditar({...clienteAEditar, telefono: e.target.value})} required/></div>
                <div className="md:col-span-2"><label className="block text-sm mb-1">Dirección</label><input className="w-full p-2 border rounded" value={clienteAEditar.direccion || ''} onChange={e => setClienteAEditar({...clienteAEditar, direccion: e.target.value})} required/></div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setClienteAEditar(null)} className="px-4 py-2 bg-gray-100 rounded">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded flex items-center gap-2"><Save size={18}/> Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmación Dar de Baja */}
      {clienteAEliminar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden text-center p-6">
            <div className="mx-auto w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4"><AlertTriangle size={32} /></div>
            <h2 className="text-xl font-bold mb-2">¿Dar de baja?</h2>
            <p className="text-gray-500 mb-6 text-sm">Estás a punto de desactivar a <strong>{clienteAEliminar.ci}</strong>.</p>
            <div className="flex gap-3">
              <button onClick={() => setClienteAEliminar(null)} disabled={procesandoBaja} className="flex-1 bg-gray-100 py-2 rounded">Cancelar</button>
              <button onClick={handleDesactivar} disabled={procesandoBaja} className="flex-1 bg-red-600 text-white py-2 rounded disabled:opacity-50">
                {procesandoBaja ? 'Procesando...' : 'Desactivar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}