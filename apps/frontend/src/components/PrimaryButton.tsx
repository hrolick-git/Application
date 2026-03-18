import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function PrimaryButton({
  isLoading = false,
  fullWidth = true,
  className = '',
  children,
  disabled,
  ...props
}: PrimaryButtonProps) {
  const baseClasses =
    'py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed';

  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${widthClasses} ${baseClasses} ${className}`}
      {...props}
    >
      {isLoading ? 'Processing...' : children}
    </button>
  );
}

