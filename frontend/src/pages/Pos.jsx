import { ShoppingCart } from 'lucide-react';

export default function Pos() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4 shadow-inner">
        <ShoppingCart size={40} />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Punto de Venta (POS)</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        Aquí la recepcionista podrá vender agua, toallas, suplementos y cobrar membresías. 
        <br/><br/>
        <span className="font-semibold text-megatlon-primary">Esperando que el Backend cree los endpoints de Ventas y Productos...</span>
      </p>
    </div>
  );
}