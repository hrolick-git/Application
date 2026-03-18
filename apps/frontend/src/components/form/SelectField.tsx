import React from 'react';

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function SelectField({ className = '', ...props }: SelectFieldProps) {
  const baseClasses =
    'w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium';

  return <select className={`${baseClasses} ${className}`} {...props} />;
}

