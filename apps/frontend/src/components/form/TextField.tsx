import React from 'react';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  inputClassName?: string;
}

export function TextField({ leftIcon, className = '', inputClassName = '', ...props }: TextFieldProps) {
  const baseInputClasses =
    'w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium';

  const withIcon = !!leftIcon;
  const finalInputClasses = withIcon
    ? baseInputClasses.replace('px-5', 'pl-12 pr-4')
    : baseInputClasses;

  return (
    <div className={`relative ${className}`}>
      {leftIcon ? (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400">{leftIcon}</div>
      ) : null}
      <input className={`${finalInputClasses} ${inputClassName}`} {...props} />
    </div>
  );
}

