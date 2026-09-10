import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Search, CalendarPlus, X, Save, AlertCircle, Dumbbell, ShieldAlert, CheckCircle } from 'lucide-react';

export default function Membresias() {
  const { user } = useContext(AuthContext);

  const [clientes, setClientes] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para el Modal de Renovación
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [exitoInfo, setExitoInfo] = useState(null);

  const [formData, setFormData] = useState({
    planId: '',
    disciplinaId: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Cargar la lista de clientes
      const endpointClientes = user.rol === 'PROPIETARIO' 
        ? '/propietario/consultas/usuarios?rol=CLIENTE' 
        : '/recepcionista/consultas/clientes';
      
      const resClientes = await api.get(endpointClientes);
      setClientes(resClientes.data);

      // 2. Cargar Catálogo (Planes y Disciplinas)
      // NOTA: Fabrizzio le puso @PreAuthorize("hasRole('PROPIETARIO')") al catálogo.
      // Si entra la recepcionista, esto podría dar 403. Lo envolvemos en un try/catch silencioso.
      try {
        const resPlanes = await api.get('/propietario/catalogo/planes');
        const resDisciplinas = await api.get('/propietario/catalogo/disciplinas');
        setPlanes(resPlanes.data);
        setDisciplinas(resDisciplinas.data);
      } catch (catErr) {
        console.warn("No se pudo cargar el catálogo. Probablemente falta permiso para Recepcionista.", catErr);
      }

    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la información. Revisa tu conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const abrirModalRenovacion = (cliente) => {
    if (planes.length === 0) {
      alert("No se cargaron los planes. Si eres Recepcionista, dile a Fabrizzio que te dé permiso al endpoint de Catálogo de Planes.");
      return;
    }
    setClienteSeleccionado(cliente);
    setFormData({ planId: '', disciplinaId: '' });
    setExitoInfo(null);
    setModalOpen(true);
  };

  // Buscamos el plan seleccionado para saber si es "ESPECIFICO" y mostrar el selector de disciplinas
  const planSeleccionadoObj = planes.find(p => p.id === parseInt(formData.planId));
  const requiereDisciplina = planSeleccionadoObj?.tipoPlan === 'ESPECIFICO';

  const handleRenovar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const endpoint = user.rol === 'PROPIETARIO'
        ? `/propietario/clientes/${clienteSeleccionado.ci}/renovar-plan`
        : `/recepcionista/clientes/${clienteSeleccionado.ci}/renovar-plan`;

      const payload = {
        planId: parseInt(formData.planId),
        disciplinaId: requiereDisciplina ? parseInt(formData.disciplinaId) : null
      };

      const res = await api.put(endpoint, payload);
      
      setExitoInfo(res.data);
      cargarDatos(); // Recargar la tabla por detrás

    } catch (err) {
      alert("Error al renovar: " + (err.response?.data?.message || err.message));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Control de Membresías</h1>
          <p className="text-gray-500 mt-1">Gestiona los planes de los clientes y renueva sus suscripciones.</p>
        </div>
      </div>

      {/* Tarjeta Principal */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Buscar cliente por nombre o CI..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-megatlon-primary focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        {loading && <div className="p-8 text-center text-gray-500">Cargando membresías...</div>}
        {error && <div className="p-8 text-center text-red-500 flex flex-col items-center"><ShieldAlert size={48} className="mb-2 opacity-50"/>{error}</div>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Plan Actual</th>
                  <th className="px-6 py-4">Disciplina</th>
                  <th className="px-6 py-4">Vencimiento</th>
                  <th className="px-6 py-4">Estado Acceso</th>
                  <th className="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clientes.map((cli) => (
                  <tr key={cli.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{cli.nombreCompleto}</div>
                      <div className="text-xs text-gray-400 font-mono">CI: {cli.ci}</div>
                    </td>
                    
                    {/* El DTO del Propietario a veces no trae el planNombre, validamos eso */}
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {cli.planNombre ? cli.planNombre : <span className="text-gray-400 italic">Sin plan activo</span>}
                    </td>
                    
                    <td className="px-6 py-4 text-gray-500">
                      {cli.disciplinaNombre || '---'}
                    </td>
                    
                    <td className="px-6 py-4">
                      {cli.fechaFinMembresia ? (
                        <span className={new Date(cli.fechaFinMembresia) < new Date() ? 'text-red-500 font-bold' : 'text-gray-600'}>
                          {cli.fechaFinMembresia}
                        </span>
                      ) : '---'}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${cli.estadoAcceso === 'ACTIVO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {cli.estadoAcceso}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => abrirModalRenovacion(cli)} 
                        className="flex items-center gap-2 ml-auto text-megatlon-primary hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium"
                      >
                        <CalendarPlus size={18} />
                        Vender / Renovar
                      </button>
                    </td>
                  </tr>
                ))}
                {clientes.length === 0 && (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No hay clientes registrados en esta sucursal.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                <Dumbbell className="text-megatlon-primary"/> Renovar Plan
              </h2>
              <button onClick={() => setModalOpen(false)}><X className="text-gray-400 hover:text-gray-600"/></button>
            </div>

            {exitoInfo ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">¡Suscripción Renovada!</h3>
                <p className="text-gray-600">El acceso de <strong>{exitoInfo.nombreCompleto}</strong> ha sido habilitado.</p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4 text-sm text-left">
                  <p><strong>Plan:</strong> {exitoInfo.planNombre}</p>
                  <p><strong>Válido hasta:</strong> <span className="text-megatlon-primary font-bold">{exitoInfo.fechaFinMembresia}</span></p>
                </div>
                <button onClick={() => setModalOpen(false)} className="w-full bg-gray-800 hover:bg-gray-900 text-white px-8 py-2 rounded-lg font-medium transition-colors mt-4">
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleRenovar} className="p-6 space-y-4">
                <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-4">
                  Renovando a: <strong>{clienteSeleccionado?.nombreCompleto}</strong> (CI: {clienteSeleccionado?.ci})
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Plan *</label>
                  <select 
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-megatlon-primary"
                    value={formData.planId} 
                    onChange={e => setFormData({...formData, planId: e.target.value})}
                  >
                    <option value="">-- Elige un Plan --</option>
                    {planes.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} (Bs. {p.precio}) - {p.duracionDias} días
                      </option>
                    ))}
                  </select>
                </div>

                {requiereDisciplina && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Disciplina *</label>
                    <select 
                      required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-megatlon-primary"
                      value={formData.disciplinaId} 
                      onChange={e => setFormData({...formData, disciplinaId: e.target.value})}
                    >
                      <option value="">-- Elige la Disciplina --</option>
                      {disciplinas.map(d => (
                        <option key={d.id} value={d.id}>{d.nombre}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Este plan requiere elegir a qué clase específica asistirá el cliente.</p>
                  </div>
                )}

                <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-gray-700">Cancelar</button>
                  <button type="submit" disabled={guardando || !formData.planId} className="px-6 py-2 bg-megatlon-primary hover:bg-red-700 text-white rounded flex items-center gap-2 disabled:opacity-50">
                    <Save size={18}/> {guardando ? 'Procesando...' : 'Confirmar Venta'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}