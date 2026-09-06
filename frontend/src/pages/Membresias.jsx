import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Plus, Edit, Trash2, CheckCircle, ShieldAlert, 
  Dumbbell, AlertTriangle, Save, X, Loader2 
} from 'lucide-react';

export default function Membresias() {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para Modales
  const [modalNuevoOpen, setModalNuevoOpen] = useState(false);
  const [planAEliminar, setPlanAEliminar] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // Formulario para Nuevo Plan
  const estadoInicialForm = {
    nombre: '',
    descripcion: '',
    duracionDias: 30,
    precio: ''
  };
  const [nuevoPlan, setNuevoPlan] = useState(estadoInicialForm);

  useEffect(() => {
    cargarPlanes();
  }, []);

  const cargarPlanes = async () => {
    try {
      setLoading(true);
      // Endpoint para obtener los planes/membresías
      const response = await api.get('/propietario/consultas/membresias');
      setPlanes(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar membresías:", err);
      setError("No se pudieron cargar los planes de membresía. Revisa la conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleCrearPlan = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await api.post('/propietario/gestion/membresias', nuevoPlan);
      cargarPlanes();
      setModalNuevoOpen(false);
      setNuevoPlan(estadoInicialForm);
    } catch (err) {
      alert("Error al crear el plan: " + (err.response?.data?.message || err.message));
    } finally {
      setGuardando(false);
    }
  };

  const handleDesactivarPlan = async () => {
    if (!planAEliminar) return;
    setGuardando(true);
    try {
      await api.delete(`/propietario/gestion/membresias/${planAEliminar.id}`);
      setPlanAEliminar(null);
      cargarPlanes();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al cambiar estado de la membresía');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Planes de Membresía</h1>
          <p className="text-gray-500 mt-1">Administra los paquetes, tarifas y duraciones del gimnasio.</p>
        </div>
        <button 
          onClick={() => setModalNuevoOpen(true)}
          className="flex items-center gap-2 bg-megatlon-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Nuevo Plan
        </button>
      </div>

      {/* Estados de Carga o Error */}
      {loading && (
        <div className="flex justify-center items-center p-12 text-gray-500">
          <Loader2 className="animate-spin mr-2" size={24} />
          Cargando planes de membresía...
        </div>
      )}

      {error && (
        <div className="p-8 flex flex-col items-center justify-center text-red-500 bg-white rounded-xl border border-red-100">
          <ShieldAlert size={48} className="mb-2 opacity-50" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Tarjetas de Planes */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planes.map((plan) => (
            <div 
              key={plan.id} 
              className={`bg-white rounded-xl p-6 border shadow-sm flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:shadow-md ${
                plan.estado === 'ACTIVO' ? 'border-gray-100' : 'border-red-200 bg-gray-50 opacity-75'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-red-50 text-megatlon-primary rounded-lg">
                    <Dumbbell size={24} />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    plan.estado === 'ACTIVO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {plan.estado || 'ACTIVO'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-1">{plan.nombre}</h3>
                <p className="text-sm text-gray-500 mb-4 min-h-10">{plan.descripcion || 'Sin descripción detallada.'}</p>

                <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-sm font-semibold text-gray-500">Bs.</span>
                    <span className="text-3xl font-extrabold text-gray-800">{plan.precio}</span>
                  </div>
                  <p className="text-xs text-gray-400 font-medium">Duración: {plan.duracionDias} días</p>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                {plan.estado === 'INACTIVO' ? (
                  <button 
                    onClick={() => alert("Pendiente de habilitar reactivación en backend")}
                    className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-semibold p-2"
                  >
                    <CheckCircle size={16} /> Reactivar
                  </button>
                ) : (
                  <button 
                    onClick={() => setPlanAEliminar(plan)}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold p-2"
                  >
                    <Trash2 size={16} /> Desactivar
                  </button>
                )}
              </div>
            </div>
          ))}

          {planes.length === 0 && (
            <div className="col-span-full bg-white p-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              No hay planes de membresía registrados. Crea uno nuevo para empezar.
            </div>
          )}
        </div>
      )}

      {/* Modal Crear Nuevo Plan */}
      {modalNuevoOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                <Dumbbell className="text-megatlon-primary"/> Registrar Nuevo Plan
              </h2>
              <button onClick={() => setModalNuevoOpen(false)}>
                <X className="text-gray-400 hover:text-gray-600"/>
              </button>
            </div>

            <form onSubmit={handleCrearPlan} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Plan *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. Plan Trimestral / Passe Libre"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-megatlon-primary focus:outline-none"
                  value={nuevoPlan.nombre}
                  onChange={e => setNuevoPlan({...nuevoPlan, nombre: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea 
                  rows="3"
                  placeholder="Incluye acceso libre a máquinas, casillero, etc."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-megatlon-primary focus:outline-none"
                  value={nuevoPlan.descripcion}
                  onChange={e => setNuevoPlan({...nuevoPlan, descripcion: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duración (Días) *</label>
                  <input 
                    type="number"
                    min="1"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-megatlon-primary focus:outline-none"
                    value={nuevoPlan.duracionDias}
                    onChange={e => setNuevoPlan({...nuevoPlan, duracionDias: parseInt(e.target.value) || ''})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio (Bs.) *</label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="250.00"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-megatlon-primary focus:outline-none"
                    value={nuevoPlan.precio}
                    onChange={e => setNuevoPlan({...nuevoPlan, precio: e.target.value})}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                <button 
                  type="button" 
                  onClick={() => setModalNuevoOpen(false)} 
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={guardando} 
                  className="px-6 py-2 bg-megatlon-primary hover:bg-red-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  {guardando ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                  {guardando ? 'Guardando...' : 'Crear Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmación de Baja */}
      {planAEliminar && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden text-center p-6">
            <div className="mx-auto w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">¿Desactivar plan?</h2>
            <p className="text-gray-500 mb-6 text-sm">
              El plan <strong>{planAEliminar.nombre}</strong> ya no estará disponible para nuevas inscripciones.
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setPlanAEliminar(null)} 
                disabled={guardando} 
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDesactivarPlan} 
                disabled={guardando} 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg disabled:opacity-50 flex justify-center items-center"
              >
                {guardando ? <Loader2 className="animate-spin" size={18}/> : 'Desactivar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}