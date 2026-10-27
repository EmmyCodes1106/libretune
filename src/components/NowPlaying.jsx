import React, { useEffect } from 'react';
import { 
  ChevronDown, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Heart, 
  ListPlus, 
  ExternalLink,
  ListMusic,
  Trash2
} from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { useLibraryStore } from '../store/libraryStore';
import { formatTime } from '../utils/formatTime';
import { useAudio } from '../hooks/useAudio';

export default function NowPlaying() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    shuffle,
    repeatMode,
    queue,
    isExpanded,
    toggleExpanded,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    playTrack,
    removeFromQueue,
    clearQueue,
  } = usePlayerStore();

  const { isFavorite, toggleFavorite } = useLibraryStore();
  const { seek } = useAudio();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isExpanded) {
        toggleExpanded();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, toggleExpanded]);

  if (!isExpanded || !currentTrack) return null;

  const favorited = isFavorite(currentTrack.id);
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const handleSeekChange = (e) => {
    const val = parseFloat(e.target.value);
    seekTo(val);
    seek(val);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-brand-canvas/95 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-200 select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Now Playing View"
    >
      <div className="max-w-[1440px] mx-auto min-h-screen px-4 sm:px-8 md:px-12 py-6 flex flex-col justify-between">
        {/* Top Header / Dismiss Bar */}
        <header className="flex items-center justify-between pb-6 border-b border-brand-border/40">
          <div className="flex items-center gap-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-brand-accent">
              Now Playing &middot; {currentTrack.album || 'LibreTune'}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleExpanded}
            className="w-10 h-10 rounded-control flex items-center justify-center bg-brand-surface border border-brand-border hover:bg-brand-raised text-brand-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            aria-label="Collapse Now Playing view"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </header>

        {/* Main Content Layout (Desktop 2-column, Mobile 1-column) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-8 flex-1 items-start">
          {/* Left Column: Artwork, Metadata, Controls */}
          <div className="lg:col-span-7 flex flex-col space-y-6 max-w-xl mx-auto lg:mx-0 w-full">
            {/* Artwork */}
            <div className="relative aspect-square w-full rounded-card overflow-hidden bg-brand-raised shadow-soft border border-brand-border/40">
              <img
                src={currentTrack.artworkUrl}
                alt={`${currentTrack.title} cover`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title, Artist, & Quick Actions */}
            <div className="flex items-start justify-between gap-4 pt-2">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-brand-text-primary truncate">
                  {currentTrack.title}
                </h1>
                <p className="text-base sm:text-lg text-brand-text-secondary truncate mt-1">
                  {currentTrack.artist}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleFavorite(currentTrack)}
                  className={`w-11 h-11 rounded-control flex items-center justify-center transition-all ${
                    favorited
                      ? 'bg-brand-action text-white shadow-soft'
                      : 'bg-brand-surface border border-brand-border text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-raised'
                  }`}
                  aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-5 h-5 ${favorited ? 'fill-white' : ''}`} />
                </button>
              </div>
            </div>

            {/* Preview status and Deezer source */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="font-bold px-2.5 py-1 rounded bg-brand-raised text-brand-text-primary border border-brand-border">
                {currentTrack.hasPreview === false ? 'No preview available' : '30-second preview'}
              </span>
              <a
                href={currentTrack.shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent hover:underline flex items-center gap-1 font-medium ml-1"
              >
                <span>Listen on Deezer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Seeker & Time Labels */}
            <div className="space-y-2 pt-2">
              <div className="relative flex items-center group py-2">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={progress}
                  onChange={handleSeekChange}
                  className="w-full h-1.5 bg-brand-raised rounded-full appearance-none cursor-pointer focus:outline-none"
                  aria-label="Seek track position"
                />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-brand-accent rounded-full pointer-events-none group-hover:bg-brand-action transition-colors"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-medium text-brand-text-secondary">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Playback Controls Row */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 pt-2">
              {/* Shuffle */}
              <button
                type="button"
                onClick={toggleShuffle}
                className={`w-10 h-10 flex items-center justify-center rounded-control transition-colors ${
                  shuffle ? 'text-brand-accent' : 'text-brand-text-secondary hover:text-brand-text-primary'
                }`}
                aria-label={shuffle ? 'Shuffle enabled' : 'Shuffle disabled'}
              >
                <Shuffle className="w-5 h-5" />
              </button>

              {/* Skip Back */}
              <button
                type="button"
                onClick={prevTrack}
                className="w-11 h-11 flex items-center justify-center rounded-control text-brand-text-secondary hover:text-brand-text-primary transition-colors active:scale-95"
                aria-label="Previous track"
              >
                <SkipBack className="w-6 h-6 fill-current" />
              </button>

              {/* Play / Pause Primary Button */}
              <button
                type="button"
                onClick={togglePlay}
                disabled={currentTrack.hasPreview === false}
                className="w-16 h-16 rounded-full bg-brand-action hover:bg-brand-action-hover active:bg-brand-action-active text-white flex items-center justify-center shadow-soft transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label={currentTrack.hasPreview === false ? 'No preview available' : isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-current" />
                ) : (
                  <Play className="w-7 h-7 fill-current ml-1" />
                )}
              </button>

              {/* Skip Next */}
              <button
                type="button"
                onClick={nextTrack}
                className="w-11 h-11 flex items-center justify-center rounded-control text-brand-text-secondary hover:text-brand-text-primary transition-colors active:scale-95"
                aria-label="Next track"
              >
                <SkipForward className="w-6 h-6 fill-current" />
              </button>

              {/* Repeat */}
              <button
                type="button"
                onClick={toggleRepeat}
                className={`w-10 h-10 flex items-center justify-center rounded-control transition-colors ${
                  repeatMode !== 'off' ? 'text-brand-accent' : 'text-brand-text-secondary hover:text-brand-text-primary'
                }`}
                aria-label={`Repeat mode: ${repeatMode}`}
              >
                {repeatMode === 'one' ? (
                  <Repeat1 className="w-5 h-5" />
                ) : (
                  <Repeat className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Album Context Caption */}
            <div className="pt-4 text-xs text-brand-text-secondary/80 leading-relaxed border-t border-brand-border/40">
              <p>
                From {currentTrack.album} &middot; 30-second preview.
              </p>
            </div>
          </div>

          {/* Right Column: Up Next Queue */}
          <div className="lg:col-span-5 rounded-card bg-brand-surface border border-brand-border/60 p-5 sm:p-6 space-y-4 shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
              <div className="space-y-0.5">
                <h3 className="text-xl font-bold text-brand-text-primary">
                  Up next
                </h3>
                <p className="text-xs text-brand-text-secondary">
                  Playing next in queue
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-brand-text-secondary px-2 py-0.5 rounded bg-brand-raised">
                  {queue.length} {queue.length === 1 ? 'track' : 'tracks'}
                </span>

                {queue.length > 0 && (
                  <button
                    type="button"
                    onClick={clearQueue}
                    className="p-1 rounded-control text-brand-text-secondary hover:text-red-400 transition-colors"
                    aria-label="Clear queue"
                    title="Clear queue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Queue List */}
            {queue.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <ListMusic className="w-8 h-8 text-brand-text-secondary/40 mx-auto" />
                <p className="text-sm font-medium text-brand-text-secondary">
                  Queue is empty
                </p>
                <p className="text-xs text-brand-text-secondary/70">
                  Add tracks from Home, Search, or Playlists.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {queue.map((track, idx) => (
                  <div
                    key={`${track.id}-${idx}`}
                    className="group p-2.5 rounded-control bg-brand-canvas/60 border border-brand-border/40 hover:border-brand-accent/40 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div 
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                      onClick={() => playTrack(track, queue)}
                    >
                      <img
                        src={track.artworkUrl}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-brand-raised shrink-0 shadow-sm"
                        loading="lazy"
                      />

                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-xs sm:text-sm text-brand-text-primary group-hover:text-brand-accent truncate transition-colors">
                          {track.title}
                        </h4>
                        <p className="text-[11px] text-brand-text-secondary truncate mt-0.5">
                          {track.artist} &middot; {track.hasPreview === false ? 'No preview available' : 'Preview'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-brand-text-secondary font-medium">
                        {track.hasPreview === false ? 'Unavailable' : '0:30'}
                      </span>

                      <button
                        type="button"
                        onClick={() => playTrack(track, queue)}
                        disabled={track.hasPreview === false}
                        className="p-1.5 rounded-control text-brand-text-secondary hover:text-brand-accent hover:bg-brand-raised transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label={track.hasPreview === false ? 'No preview available' : `Play ${track.title} now`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromQueue(track.id)}
                        className="p-1.5 rounded-control text-brand-text-secondary hover:text-red-400 hover:bg-brand-raised transition-colors"
                        aria-label={`Remove ${track.title} from queue`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Queue Disclaimer */}
            <div className="pt-3 border-t border-brand-border/40 flex items-center justify-between text-[11px] text-brand-text-secondary/70">
              <span>Only this playlist. No surprises.</span>
              <ListMusic className="w-4 h-4 text-brand-accent" />
            </div>
          </div>
        </div>

        <footer className="pt-6 border-t border-brand-border/40 text-xs text-brand-text-secondary/70 text-center">
          <p>Music data and previews provided by Deezer,</p>
        </footer>
      </div>
    </div>
  );
}
