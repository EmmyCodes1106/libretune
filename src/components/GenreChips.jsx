import React from 'react';

export default function GenreChips({ selectedGenre = 'all', onSelectGenre, genres = [] }) {
  const availableGenres = [{ id: 'all', name: 'All' }, ...genres];
  return (
    <div 
      className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none select-none"
      role="tablist"
      aria-label="Filter by genre"
    >
      {availableGenres.map((genre) => {
        const isSelected = String(selectedGenre) === String(genre.id);
        return (
          <button
            key={genre.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectGenre(genre.id)}
            className={`px-5 py-2 rounded-chip text-sm font-medium whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent min-h-[40px] ${
              isSelected
                ? 'bg-brand-action text-white shadow-soft scale-100 font-semibold'
                : 'bg-brand-surface border border-brand-border text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-raised/60'
            }`}
          >
            {genre.name}
          </button>
        );
      })}
    </div>
  );
}
