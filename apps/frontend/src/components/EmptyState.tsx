import { ReactNode } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ 
  title, 
  message, 
  icon = <MagnifyingGlassIcon className="w-12 h-12 text-slate-300" />, 
  action 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in duration-500">
      {/* Анімована іконка */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-100 rounded-[2rem] blur-2xl opacity-50 animate-pulse"></div>
        <div className="relative bg-white w-24 h-24 rounded-[2.2rem] shadow-xl shadow-indigo-100/50 flex items-center justify-center border border-slate-50 transform hover:rotate-6 transition-transform duration-300">
          {icon}
        </div>
      </div>

      {/* Текстовий блок */}
      <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium leading-relaxed">
        {message}
      </p>

      {/* Кнопка дії (якщо є) */}
      {action && (
        <div className="w-full max-w-xs transform hover:scale-105 transition-transform">
          {action}
        </div>
      )}
    </div>
  );
}