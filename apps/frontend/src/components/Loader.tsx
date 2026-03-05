import { TicketIcon } from '@heroicons/react/24/outline';

export function Loader() {
  return (
    <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Пульсуюче коло на фоні */}
        <div className="absolute w-16 h-16 bg-indigo-100 rounded-2xl animate-ping opacity-75"></div>
        
        {/* Основна іконка */}
        <div className="relative bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-200">
          <TicketIcon className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>
      <span className="text-slate-400 font-medium tracking-widest text-xs uppercase animate-pulse">
        Loading Events...
      </span>
    </div>
  );
}