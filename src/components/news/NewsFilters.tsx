'use client';

import { NewsCategory } from '@/types';
import { NEWS_CATEGORIES, CategoryConfig } from '@/data/categories';

interface NewsFiltersProps {
  selectedCategory: NewsCategory | null;
  onCategoryChange: (category: NewsCategory | null) => void;
}

export function NewsFilters({ selectedCategory, onCategoryChange }: NewsFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange(null)}
        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
          selectedCategory === null
            ? 'bg-tactical-green text-background border-tactical-green'
            : 'border-border text-text-secondary hover:border-text-muted hover:text-foreground'
        }`}
      >
        All
      </button>
      {NEWS_CATEGORIES.map((category: CategoryConfig) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            selectedCategory === category.id
              ? 'text-background border-transparent'
              : 'border-border text-text-secondary hover:border-text-muted hover:text-foreground'
          }`}
          style={
            selectedCategory === category.id
              ? { backgroundColor: category.color }
              : undefined
          }
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
