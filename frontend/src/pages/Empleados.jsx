import { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Plus, Edit, Trash2, ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';
import ModalNuevoEmpleado from '../components/ModalNuevoEmpleado';
import ModalEditarEmpleado from '../components/ModalEditarEmpleado';

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Nuevos estados para Editar y Eliminar
  const [empleadoAEditar, setEmpleadoAEditar] = useState(null);
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
  const [procesandoBaja, setProcesandoBaja] = useState(false);

  // Se ejecuta automáticamente al entrar a la pantalla
  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      setLoading(true);
      // Consumimos el endpoint de listar usuarios que hizo Fabrizzio
      const response = await api.get('/propietario/consultas/usuarios');
      
      // Filtramos para que no salgan los clientes en esta pantalla
      const soloPersonal = response.data.filter(usuario => usuario.rol !== 'CLIENTE');
      setEmpleados(soloPersonal);
      setError(null);
    } catch (err) {
      console.error("Error cargando empleados:", err);
      setError("No se pudo conectar con el servidor. ¿Está el backend encendido?");
    } finally {
      setLoading(false);
    }
  };

  const handleDesactivarEmpleado = async () => {
    if (!empleadoAEliminar) return;
    
    setProcesandoBaja(true);
    try {
      // Llamamos al endpoint de Fabrizzio para desactivar (Soft delete)
      await api.delete(`/propietario/gestion/usuarios/${empleadoAEliminar.ci}`);
      setEmpleadoAEliminar(null);
      cargarEmpleados(); // Recargamos la tabla
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error al desactivar empleado');
    } finally {
      setProcesandoBaja(false);
    }
  };

  // Función para determinar el color de la "pastillita" del rol
  const getBadgeColor = (rol) => {
    switch (rol) {
      case 'PROPIETARIO': return 'bg-gray-100 text-gray-800';
      case 'RECEPCIONISTA': return 'bg-purple-100 text-purple-800';
      case 'INSTRUCTOR': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Cabecera de la pantalla */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Personal</h1>
          <p className="text-gray-500 mt-1">Administra a los instructores y recepcionistas del gimnasio.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-megatlon-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Nuevo Empleado
        </button>
      </div>

      {/* Tarjeta con la Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Barra de herramientas (Buscador) */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Buscar por nombre o carnet..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-megatlon-primary focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        {/* Mensajes de estado (Cargando o Error) */}
        {loading && (
          <div className="p-8 text-center text-gray-500 font-medium">
            Cargando personal de Megatlon...
          </div>
        )}

        {error && (
          <div className="p-8 flex flex-col items-center justify-center text-red-500">
            <ShieldAlert size={48} className="mb-2 opacity-50" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Tabla de Datos */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Empleado</th>
                  <th className="px-6 py-4">CI</th>
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-6 py-4">Sucursal</th>
                  <th className="px-6 py-4">Salario Base</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {empleados.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{emp.nombreCompleto}</div>
                      <div className="text-xs text-gray-400">{emp.telefono}</div>
                    </td>
                    <td className="px-6 py-4">{emp.ci}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(emp.rol)}`}>
                        {emp.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4">{emp.sucursalNombre}</td>
                    <td className="px-6 py-4">
                      {emp.salarioFijo ? `Bs. ${emp.salarioFijo}` : '---'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1 font-medium ${emp.estadoAcceso === 'ACTIVO' ? 'text-green-600' : 'text-red-500'}`}>
                        <div className={`w-2 h-2 rounded-full ${emp.estadoAcceso === 'ACTIVO' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        {emp.estadoAcceso}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setEmpleadoAEditar(emp)} 
                        className="text-blue-500 hover:text-blue-700 p-1 mx-1 transition-colors" 
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      
                      {/* LÓGICA DE ACTIVAR / DESACTIVAR */}
                      {emp.rol !== 'PROPIETARIO' && (
                        emp.estadoAcceso === 'INACTIVO' ? (
                          <button 
                            onClick={() => alert("El backend aún no tiene el endpoint para Reactivar. ¡Dile a Fabrizzio que lo haga!")} 
                            className="text-green-500 hover:text-green-700 p-1 mx-1 transition-colors" 
                            title="Reactivar Usuario"
                          >
                            <CheckCircle size={18} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => setEmpleadoAEliminar(emp)} 
                            className="text-red-500 hover:text-red-700 p-1 mx-1 transition-colors" 
                            title="Dar de baja"
                          >
                            <Trash2 size={18} />
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
                
                {empleados.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No hay empleados registrados aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Renderizamos el Modal invisible hasta que isModalOpen sea true */}
      <ModalNuevoEmpleado 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={cargarEmpleados} 
      />

      {}
      <ModalEditarEmpleado
        isOpen={!!empleadoAEditar}
        empleado={empleadoAEditar}
        onClose={() => setEmpleadoAEditar(null)}
        onSuccess={cargarEmpleados}
      />

      {/* Modal de Confirmación para Dar de Baja */}
      {empleadoAEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden text-center p-6">
            <div className="mx-auto w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">¿Dar de baja?</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Estás a punto de desactivar a <strong>{empleadoAEliminar.nombreCompleto}</strong>. Ya no podrá ingresar al sistema.
            </p>
            
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setEmpleadoAEliminar(null)}
                disabled={procesandoBaja}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDesactivarEmpleado}
                disabled={procesandoBaja}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {procesandoBaja ? 'Procesando...' : 'Sí, Desactivar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}