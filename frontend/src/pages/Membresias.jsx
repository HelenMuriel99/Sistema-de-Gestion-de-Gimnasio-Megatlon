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

      // 1. Cargar la lista de clientes (Fabrizzio nos recomendó filtrar por rol=CLIENTE)
      const endpointClientes = user.rol === 'PROPIETARIO' 
        ? '/propietario/consultas/usuarios?rol=CLIENTE' 
        : '/recepcionista/consultas/clientes';
      
      const resClientes = await api.get(endpointClientes);
      setClientes(resClientes.data);

      // 2. Cargar Catálogo (Planes y Disciplinas)
      try {
        const resPlanes = await api.get('/propietario/catalogo/planes');
        const resDisciplinas = await api.get('/propietario/catalogo/disciplinas');
        setPlanes(resPlanes.data);
        setDisciplinas(resDisciplinas.data);
      } catch (catErr) {
        console.warn("Error al cargar el catálogo de planes. Verifica los permisos de Spring Security.", catErr);
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
      alert("No se pudieron cargar los planes. Asegúrate de que el backend tenga planes registrados.");
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
      
      // Guardamos la respuesta exitosa para mostrar el ticket de confirmación
      setExitoInfo(res.data);
      cargarDatos(); // Recargar la tabla por detrás para actualizar las fechas

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
                {clientes.map((cli) => {
                  // Lógica para detectar si la membresía expiró
                  const fechaFin = cli.fechaFinMembresia ? new Date(cli.fechaFinMembresia) : null;
                  const hoy = new Date();
                  const estaVencido = fechaFin && fechaFin < hoy;

                  return (
                    <tr key={cli.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-800">{cli.nombreCompleto}</div>
                        <div className="text-xs text-gray-400 font-mono">CI: {cli.ci} {cli.complementoCi ? `-${cli.complementoCi}` : ''}</div>
                      </td>
                      
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {cli.planNombre ? cli.planNombre : <span className="text-gray-400 italic">Sin plan</span>}
                      </td>
                      
                      <td className="px-6 py-4 text-gray-500">
                        {cli.disciplinaNombre || '---'}
                      </td>
                      
                      <td className="px-6 py-4">
                        {cli.fechaFinMembresia ? (
                          <span className={estaVencido ? 'text-red-600 font-bold bg-red-50 px-2 py-1 rounded' : 'text-gray-600 font-medium'}>
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
                          className="flex items-center gap-2 ml-auto text-megatlon-primary hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium border border-transparent hover:border-red-200"
                        >
                          <CalendarPlus size={18} />
                          Renovar
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {clientes.length === 0 && (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No hay clientes para mostrar.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                <Dumbbell className="text-megatlon-primary"/> Renovar Plan
              </h2>
              <button onClick={() => setModalOpen(false)}><X className="text-gray-400 hover:text-gray-600"/></button>
            </div>

            {/* PANTALLA DE ÉXITO (Ticket de compra) */}
            {exitoInfo ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">¡Suscripción Renovada!</h3>
                <p className="text-gray-600">El acceso de <strong>{exitoInfo.nombreCompleto}</strong> ha sido habilitado con éxito.</p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4 text-sm text-left shadow-inner">
                  <p className="mb-2"><strong>Plan:</strong> {exitoInfo.planNombre}</p>
                  <p className="mb-2"><strong>Disciplina:</strong> {exitoInfo.disciplinaNombre || 'Todas las áreas'}</p>
                  <p className="mb-2"><strong>Cobrado:</strong> Bs. {exitoInfo.planPrecio}</p>
                  <div className="border-t border-gray-200 my-2 pt-2"></div>
                  <p><strong>Válido hasta:</strong> <span className="text-megatlon-primary font-bold text-base">{exitoInfo.fechaFinMembresia}</span></p>
                </div>
                <button onClick={() => setModalOpen(false)} className="w-full bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-bold transition-colors mt-4">
                  Cerrar
                </button>
              </div>
            ) : (
              /* FORMULARIO DE VENTA/RENOVACIÓN */
              <form onSubmit={handleRenovar} className="p-6 space-y-5">
                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm border border-blue-100">
                  Renovando a: <br/>
                  <span className="font-bold text-base">{clienteSeleccionado?.nombreCompleto}</span> (CI: {clienteSeleccionado?.ci})
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Seleccionar Plan *</label>
                  <select 
                    required
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-megatlon-primary outline-none"
                    value={formData.planId} 
                    onChange={e => setFormData({...formData, planId: e.target.value, disciplinaId: ''})}
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
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-bold text-megatlon-primary mb-1">Seleccionar Disciplina *</label>
                    <select 
                      required
                      className="w-full p-2.5 border border-megatlon-primary rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-red-50"
                      value={formData.disciplinaId} 
                      onChange={e => setFormData({...formData, disciplinaId: e.target.value})}
                    >
                      <option value="">-- Elige la Disciplina --</option>
                      {disciplinas.map(d => (
                        <option key={d.id} value={d.id}>{d.nombre}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12}/> Este plan requiere elegir la clase específica.
                    </p>
                  </div>
                )}

                <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 font-medium transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={guardando || !formData.planId} className="px-6 py-2.5 bg-megatlon-primary hover:bg-red-700 text-white rounded-lg flex items-center gap-2 font-bold disabled:opacity-50 transition-colors">
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