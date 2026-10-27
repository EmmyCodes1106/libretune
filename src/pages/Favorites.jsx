import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Play, Pause, X, ListPlus, Search, Music } from 'lucide-react';
import { useLibraryStore } from '../store/libraryStore';
import { usePlayerStore } from '../store/playerStore';
import { formatTime, formatDurationSummary } from '../utils/formatTime';
import AddToPlaylistModal from '../components/AddToPlaylistModal';

export default function Favorites() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useLibraryStore();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const [activeTrackForPlaylist, setActiveTrackForPlaylist] = useState(null);

  const totalDuration = favorites.reduce((sum, t) => sum + (t.duration || 0), 0);
  const isFavoritesPlaying = isPlaying && favorites.some((t) => t.id === currentTrack?.id);

  const handlePlayAll = () => {
    if (favorites.length === 0) return;
    if (isFavoritesPlaying) {
      togglePlay();
    } else {
      const firstPlayable = favorites.find((track) => track.hasPreview !== false);
      if (firstPlayable) playTrack(firstPlayable, favorites);
    }
  };

  const handlePlayRow = (track) => {
    if (track.hasPreview === false) return;
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, favorites);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Hero Header */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center gap-6" aria-label="Favorites header">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-card bg-gradient-to-br from-[#7750E8] via-[#5C39C9] to-[#3B1F8C] flex items-center justify-center shrink-0 shadow-soft select-none">
          <Heart className="w-14 h-14 sm:w-16 sm:h-16 text-white fill-white/20" />
        </div>

        <div className="space-y-2.5">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-brand-accent">
            Your Library
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-text-primary">
            Your Favorites
          </h1>

          <p className="text-xs sm:text-sm text-brand-text-secondary">
            The tracks that stay with you.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              type="button"
              disabled={favorites.length === 0 || !favorites.some((track) => track.hasPreview !== false)}
              onClick={handlePlayAll}
              className="px-5 py-2.5 rounded-control bg-brand-action hover:bg-brand-action-hover active:bg-brand-action-active text-white text-sm font-semibold flex items-center gap-2 shadow-soft transition-all disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent min-h-[44px]"
            >
              {isFavoritesPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
              <span>{isFavoritesPlaying ? 'Pause' : 'Play all'}</span>
            </button>

            <span className="text-xs font-medium text-brand-text-secondary">
              {favorites.length} {favorites.length === 1 ? 'track' : 'tracks'} &middot; {formatDurationSummary(totalDuration)}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Device Storage Banner */}
      <div 
        className="p-3.5 rounded-control bg-brand-surface border border-brand-border/60 text-xs text-brand-text-secondary flex items-center gap-3 select-none"
        role="note"
      >
        <div className="w-2 h-2 rounded-full bg-brand-accent shrink-0 animate-pulse" />
        <span>Saved on this device. No account needed. Your favorites stay in this browser.</span>
      </div>

      {/* 3. Empty State (Specimen 03 from Figma) */}
      {favorites.length === 0 ? (
        <section 
          className="p-10 sm:p-16 rounded-card bg-brand-surface border border-brand-border/60 flex flex-col items-center justify-center text-center space-y-5 max-w-lg mx-auto my-8 select-none"
          role="region"
          aria-label="No favorites"
        >
          <div className="relative w-16 h-16 rounded-card bg-brand-raised flex items-center justify-center text-brand-accent shadow-sm">
            <Heart className="w-8 h-8 fill-brand-accent/20" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-action flex items-center justify-center text-white text-xs">
              <Music className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1.5 max-w-sm">
            <h3 className="text-xl font-bold text-brand-text-primary">
              Your next favorite is out there.
            </h3>
            <p className="text-xs sm:text-sm text-brand-text-secondary leading-relaxed">
              Tap a heart on any track to save it here. No account needed. Just a good ear.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/search')}
            className="px-6 py-2.5 rounded-control bg-brand-action hover:bg-brand-action-hover active:bg-brand-action-active text-white text-sm font-semibold flex items-center gap-2 shadow-soft transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent min-h-[44px]"
          >
            <Search className="w-4 h-4" />
            <span>Discover music</span>
          </button>
        </section>
      ) : (
        /* 4. Track List */
        <section className="space-y-3" aria-label="Favorite tracks list">
          {/* List Table Header */}
          <div className="flex items-center justify-between px-3 text-[11px] font-bold uppercase tracking-wider text-brand-text-secondary/80 select-none pb-1 border-b border-brand-border/40">
            <span>Track / Artist / License</span>
            <span className="mr-2">Remove</span>
          </div>

          <div className="space-y-2">
            {favorites.map((track) => {
              const isCurrent = currentTrack?.id === track.id;
              const isThisPlaying = isCurrent && isPlaying;
              const noPreview = track.hasPreview === false;

              return (
                <div
                  key={track.id}
                  onClick={noPreview ? undefined : () => handlePlayRow(track)}
                  className={`group ${noPreview ? 'cursor-default' : 'cursor-pointer'} p-2.5 sm:p-3 rounded-control border transition-all duration-200 flex items-center justify-between gap-3 select-none ${
                    isCurrent
                      ? 'bg-brand-raised/60 border-brand-accent/50 ring-1 ring-brand-accent/30'
                      : 'bg-brand-surface border-brand-border/60 hover:border-brand-border hover:bg-brand-raised/30'
                  }`}
                  role="button"
                  tabIndex={noPreview ? -1 : 0}
                  aria-disabled={noPreview}
                  onKeyDown={(e) => {
                    if (!noPreview && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handlePlayRow(track);
                    }
                  }}
                  aria-label={`${track.title} by ${track.artist}`}
                >
                  {/* Left: Play button, Artwork, Title & Artist */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayRow(track);
                      }}
                      disabled={noPreview}
                      className={`w-9 h-9 rounded-control flex items-center justify-center shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                        isCurrent
                          ? 'bg-brand-action text-white shadow-soft'
                          : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-raised'
                      }`}
                      aria-label={noPreview ? 'No preview available' : isThisPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                    >
                      {isThisPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    <img
                      src={track.artworkUrl}
                      alt=""
                      className="w-11 h-11 rounded-lg object-cover bg-brand-raised shrink-0 shadow-sm"
                      loading="lazy"
                    />

                    <div className="min-w-0 flex-1">
                      <h4 
                        className={`font-semibold text-sm truncate transition-colors ${
                          isCurrent ? 'text-brand-accent' : 'text-brand-text-primary group-hover:text-brand-accent'
                        }`}
                      >
                        {track.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-brand-text-secondary truncate mt-0.5">
                        <span className="truncate">{track.artist}</span>
                        <span className="shrink-0">&middot;</span>
                        <span className="shrink-0 text-[11px] font-medium text-brand-text-secondary/80">
                          {noPreview ? 'No preview available' : 'Preview'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Duration, Remove (X), Add to Playlist */}
                  <div 
                    className="flex items-center gap-2 sm:gap-3 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-xs font-medium text-brand-text-secondary hidden sm:inline-block w-10 text-right">
                      {noPreview ? 'Unavailable' : '0:30'}
                    </span>

                    {/* Remove from favorites button (X) */}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(track)}
                      className="p-2 rounded-control text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-raised transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                      aria-label={`Remove ${track.title} from favorites`}
                      title="Remove from favorites"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Add to playlist button */}
                    <button
                      type="button"
                      onClick={() => setActiveTrackForPlaylist(track)}
                      className="p-2 rounded-control text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-raised transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                      aria-label="Add to playlist"
                      title="Add to playlist"
                    >
                      <ListPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note matching Figma */}
          <div className="pt-6 border-t border-brand-border/40 text-xs text-brand-text-secondary space-y-1">
            <h4 className="font-bold text-brand-text-primary">
              A collection that&apos;s yours.
            </h4>
            <p>
              Tap the heart on any track to keep it here. Remove a favorite anytime with &times;.
            </p>
          </div>
        </section>
      )}

      {/* Add To Playlist Modal */}
      {activeTrackForPlaylist && (
        <AddToPlaylistModal
          track={activeTrackForPlaylist}
          onClose={() => setActiveTrackForPlaylist(null)}
        />
      )}
    </div>
  );
}
