import React from 'react';

interface FieldLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function FieldLabel({ children, className = '' }: FieldLabelProps) {
  return (
    <label className={`block text-sm font-black text-slate-700 mb-2 ml-1 uppercase tracking-wide ${className}`}>
      {children}
    </label>
  );
}

