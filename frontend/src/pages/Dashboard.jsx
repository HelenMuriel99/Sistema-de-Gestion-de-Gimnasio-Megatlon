import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Activity, Users, DollarSign, Calendar } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
        <p className="text-gray-500 mt-1">Bienvenido de nuevo, {user?.nombre}</p>
      </div>

      {}
      {/* Tarjetas de Resumen (Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Tarjeta 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Clientes Activos</p>
            <p className="text-2xl font-bold text-gray-800">---</p>
          </div>
        </div>

        {/* Tarjeta 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Ingresos del Día</p>
            <p className="text-2xl font-bold text-gray-800">Bs. ---</p>
          </div>
        </div>

        {/* Tarjeta 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Reservas Hoy</p>
            <p className="text-2xl font-bold text-gray-800">---</p>
          </div>
        </div>

        {/* Tarjeta 4 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Asistencias Hoy</p>
            <p className="text-2xl font-bold text-gray-800">---</p>
          </div>
        </div>
      </div>

      {}
      {/* Área de contenido principal (Gráficos o Tablas en el futuro) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Actividad Reciente</h2>
        <div className="flex items-center justify-center h-48 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
          Los datos dinámicos se cargarán aquí una vez que conectemos los demás módulos.
        </div>
      </div>
    </div>
  );
}