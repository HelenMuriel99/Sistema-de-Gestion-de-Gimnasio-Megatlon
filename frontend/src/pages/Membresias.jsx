import { Activity } from 'lucide-react';

export default function Membresias() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Activity size={64} className="text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800">Módulo de Membresías</h2>
      <p className="text-gray-500 mt-2">Próximamente... Esperando endpoints del backend.</p>
    </div>
  );
}