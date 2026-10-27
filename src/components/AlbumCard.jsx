import React from 'react';
import { Disc3, ArrowRight } from 'lucide-react';

export default function AlbumCard({ album, onPlayAlbum }) {
  if (!album) return null;

  return (
    <div
      onClick={onPlayAlbum}
      className="group cursor-pointer rounded-card bg-brand-surface border border-brand-border/60 hover:border-brand-accent/50 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 transition-all duration-200 hover:shadow-soft"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPlayAlbum?.();
        }
      }}
      aria-label={`Album: ${album.name}`}
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-control overflow-hidden bg-brand-raised shrink-0 shadow-sm">
        <img
          src={album.image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80'}
          alt={album.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Disc3 className="w-8 h-8 text-white animate-spin-slow" />
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <h4 className="font-bold text-base sm:text-lg text-brand-text-primary group-hover:text-brand-accent transition-colors truncate">
          {album.name}
        </h4>
        
        <p className="text-xs text-brand-text-secondary truncate">
          {album.artistName} {album.tracksCount ? `&middot; ${album.tracksCount} tracks` : ''}
        </p>

        <div className="pt-2">
          <span className="text-xs font-semibold text-brand-accent group-hover:text-brand-text-primary flex items-center gap-1.5 transition-colors">
            <span>Album on Deezer</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
}
