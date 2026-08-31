import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  CreditCard, 
  LogOut,
  Menu
} from 'lucide-react';

export default function Layout() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  // Definimos qué opciones de menú ve cada rol
  const getMenuOptions = () => {
    const baseOptions = [
      { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> }
    ];

    if (user?.rol === 'PROPIETARIO') {
      baseOptions.push({ name: 'Personal', path: '/empleados', icon: <Users size={20} /> });
      baseOptions.push({ name: 'Membresías', path: '/membresias', icon: <Dumbbell size={20} /> });
    }

    if (user?.rol === 'RECEPCIONISTA') {
      baseOptions.push({ name: 'Clientes', path: '/clientes', icon: <Users size={20} /> });
      baseOptions.push({ name: 'Punto de Venta', path: '/pos', icon: <CreditCard size={20} /> });
    }

    return baseOptions;
  };

  const menuOptions = getMenuOptions();

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* SIDEBAR (Barra Lateral) */}
      <aside className="w-64 bg-megatlon-dark text-white flex flex-col shadow-2xl">
        <div className="h-16 flex items-center justify-center border-b border-gray-700">
          <h1 className="text-2xl font-black text-megatlon-primary tracking-widest">MEGATLON</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuOptions.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-megatlon-primary text-white font-semibold' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:text-red-500 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOPBAR (Barra Superior) */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 border-b border-gray-200">
          <div className="flex items-center gap-2 text-gray-500">
            <Menu size={24} className="cursor-pointer lg:hidden" />
            <span className="font-medium text-gray-800">Sucursal ID: {user?.sucursalId}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">{user?.nombre || 'Usuario'}</p>
              <p className="text-xs text-gray-500 font-semibold">{user?.rol}</p>
            </div>
            {/* Avatar genérico */}
            <div className="h-10 w-10 bg-megatlon-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
              {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        {/* ÁREA DINÁMICA DE PANTALLAS (Aquí se inyectan las demás vistas) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet /> 
        </main>

      </div>
    </div>
  );
}