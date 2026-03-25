import React from 'react';
import type { Tag } from '../../types/tag';
import { TagChip } from './TagChip';

interface TagSelectorProps {
  availableTags: Tag[];
  selectedTagIds: string[];
  onChangeSelectedTagIds: (next: string[]) => void;
  maxSelected?: number;
  className?: string;
}

export function TagSelector({
  availableTags,
  selectedTagIds,
  onChangeSelectedTagIds,
  maxSelected = 5,
  className = '',
}: TagSelectorProps) {
  const toggleTag = (tagId: string) => {
    onChangeSelectedTagIds(
      selectedTagIds.includes(tagId)
        ? selectedTagIds.filter(id => id !== tagId)
        : selectedTagIds.length >= maxSelected
          ? selectedTagIds
          : [...selectedTagIds, tagId]
    );
  };

  return (
    <div className={`flex flex-wrap gap-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl ${className}`}>
      {availableTags.map(tag => {
        const selected = selectedTagIds.includes(tag.id);
        const atLimit = !selected && selectedTagIds.length >= maxSelected;
        return (
          <TagChip
            key={tag.id}
            label={tag.name}
            selected={selected}
            disabled={atLimit}
            onClick={() => toggleTag(tag.id)}
          />
        );
      })}
    </div>
  );
}

