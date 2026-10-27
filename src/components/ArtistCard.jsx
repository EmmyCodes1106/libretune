import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function ArtistCard({ artist, onClick }) {
  if (!artist) return null;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-card bg-brand-surface border border-brand-border/60 hover:border-brand-accent/50 p-3.5 flex items-center justify-between gap-3 transition-all duration-200 hover:shadow-soft"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`Artist: ${artist.name}`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <img
          src={artist.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'}
          alt={artist.name}
          className="w-14 h-14 rounded-control object-cover bg-brand-raised shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-sm sm:text-base text-brand-text-primary group-hover:text-brand-accent transition-colors truncate">
            {artist.name}
          </h4>
          <p className="text-xs text-brand-text-secondary truncate mt-0.5">
            Artist on Deezer
          </p>
        </div>
      </div>

      <div className="w-8 h-8 rounded-control flex items-center justify-center text-brand-text-secondary group-hover:text-brand-accent group-hover:bg-brand-raised transition-colors shrink-0">
        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </div>
  );
}
