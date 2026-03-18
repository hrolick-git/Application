import React from 'react';
import { getTagColorClasses } from '../../constants/tags';

interface TagChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function TagChip({
  label,
  selected = false,
  onClick,
  disabled = false,
  className = '',
}: TagChipProps) {
  const colorClasses = getTagColorClasses(label);

  const selectedClasses = selected
    ? `${colorClasses} shadow-sm scale-105`
    : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all disabled:opacity-60 disabled:cursor-not-allowed ${selectedClasses} ${className}`}
    >
      {selected && <span className="mr-1">✓</span>}
      {label}
    </button>
  );
}

