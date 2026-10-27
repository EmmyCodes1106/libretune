import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Heart, 
  ListMusic, 
  Volume2, 
  VolumeX, 
  Shuffle, 
  Repeat,
  Repeat1
} from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { useLibraryStore } from '../store/libraryStore';
import { formatTime } from '../utils/formatTime';
import { useAudio } from '../hooks/useAudio';
import QueuePanel from './QueuePanel';

export default function Player() {
  const { seek } = useAudio();
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    shuffle,
    repeatMode,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleExpanded,
    queue,
    isQueuePanelOpen,
    toggleQueuePanel,
  } = usePlayerStore();

  const { isFavorite, toggleFavorite } = useLibraryStore();

  if (!currentTrack) {
    if (queue.length === 0) return null;
    return (
      <>
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30 flex justify-end bg-brand-surface/95 px-4 py-2 border-t border-brand-border">
          <button
            type="button"
            onClick={toggleQueuePanel}
            className="relative flex items-center gap-2 rounded-control px-3 py-2 text-sm text-brand-text-secondary hover:bg-brand-raised"
            aria-label={`Open queue (${queue.length} upcoming tracks)`}
            aria-expanded={isQueuePanelOpen}
            aria-controls="queue-panel"
          >
            <ListMusic className="w-5 h-5" />
            Queue ({queue.length})
          </button>
        </div>
        <QueuePanel />
      </>
    );
  }

  const favorited = isFavorite(currentTrack.id);
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const handleSeekChange = (e) => {
    const val = parseFloat(e.target.value);
    seekTo(val);
    seek(val);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  return (
    <div 
      className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30 bg-brand-surface/95 backdrop-blur-lg border-t border-brand-border select-none"
      role="region"
      aria-label="Audio Player"
    >
      {/* Mobile Slim Progress Bar */}
      <div className="md:hidden w-full h-1 bg-brand-raised">
        <div 
          className="h-full bg-brand-accent transition-all duration-200" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-18 md:h-22 flex items-center justify-between gap-4 py-2">
        {/* Left: Track Information */}
        <div className="flex items-center gap-3.5 min-w-0 w-1/4">
          <button 
            type="button" 
            onClick={toggleExpanded}
            className="relative shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-lg"
            aria-label="Expand Now Playing view"
          >
            <img
              src={currentTrack.artworkUrl}
              alt={`${currentTrack.title} artwork`}
              className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover shadow-sm group-hover:opacity-90 transition-opacity"
              loading="lazy"
            />
          </button>

          <div className="min-w-0 flex flex-col justify-center">
            <button
              type="button"
              onClick={toggleExpanded}
              className="text-left font-semibold text-sm md:text-[15px] text-brand-text-primary hover:text-brand-accent truncate transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
            >
              {currentTrack.title}
            </button>
            <div className="flex items-center gap-1.5 text-xs text-brand-text-secondary truncate mt-0.5">
              <span className="truncate">{currentTrack.artist}</span>
              <span className="shrink-0">·</span>
              <span className="text-[11px] font-medium text-brand-text-secondary shrink-0">
                {currentTrack.source === 'deezer'
                  ? currentTrack.hasPreview === false ? 'No preview available' : '30-second preview'
                  : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Controls & Seeker (Desktop & Mobile) */}
        <div className="flex flex-col items-center justify-center flex-1 max-w-xl px-2">
          {/* Main Controls Row */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Shuffle (desktop only) */}
            <button
              type="button"
              onClick={toggleShuffle}
              className={`hidden md:flex w-8 h-8 items-center justify-center rounded-control transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                shuffle ? 'text-brand-accent' : 'text-brand-text-secondary hover:text-brand-text-primary'
              }`}
              aria-label={shuffle ? 'Shuffle enabled' : 'Shuffle disabled'}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Skip Previous */}
            <button
              type="button"
              onClick={prevTrack}
              className="w-9 h-9 flex items-center justify-center rounded-control text-brand-text-secondary hover:text-brand-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              aria-label="Previous track"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            {/* Play / Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              disabled={currentTrack.hasPreview === false}
              className="w-11 h-11 md:w-12 md:h-12 rounded-control bg-brand-action hover:bg-brand-action-hover active:bg-brand-action-active text-white flex items-center justify-center shadow-soft transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label={currentTrack.hasPreview === false ? 'No preview available' : isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Skip Next */}
            <button
              type="button"
              onClick={nextTrack}
              className="w-9 h-9 flex items-center justify-center rounded-control text-brand-text-secondary hover:text-brand-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              aria-label="Next track"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            {/* Repeat (desktop only) */}
            <button
              type="button"
              onClick={toggleRepeat}
              className={`hidden md:flex w-8 h-8 items-center justify-center rounded-control transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                repeatMode !== 'off' ? 'text-brand-accent' : 'text-brand-text-secondary hover:text-brand-text-primary'
              }`}
              aria-label={`Repeat mode: ${repeatMode}`}
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Desktop Progress Bar with Time Labels */}
          <div className="hidden md:flex items-center gap-3 w-full mt-1.5">
            <span className="text-[11px] font-medium text-brand-text-secondary w-9 text-right select-none">
              {formatTime(progress)}
            </span>

            <div className="relative flex-1 flex items-center group py-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={progress}
                onChange={handleSeekChange}
                className="w-full h-1 bg-brand-raised rounded-full appearance-none cursor-pointer focus:outline-none"
                aria-label="Seek track position"
              />
              {/* Active filled line overlay */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-accent rounded-full pointer-events-none group-hover:bg-brand-action transition-colors"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <span className="text-[11px] font-medium text-brand-text-secondary w-9 text-left select-none">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Actions, Queue, Volume */}
        <div className="flex items-center justify-end gap-2 md:gap-3 min-w-0 w-1/4">
          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={() => toggleFavorite(currentTrack)}
            className={`w-10 h-10 rounded-control flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
              favorited 
                ? 'text-brand-accent bg-brand-raised' 
                : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-raised/50'
            }`}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-5 h-5 ${favorited ? 'fill-brand-accent text-brand-accent' : ''}`} />
          </button>

          {/* Queue Button */}
          <button
            type="button"
            onClick={toggleQueuePanel}
            className="relative w-10 h-10 rounded-control flex items-center justify-center text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-raised/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            aria-label={`Open queue (${queue.length} upcoming tracks)`}
            aria-expanded={isQueuePanelOpen}
            aria-controls="queue-panel"
          >
            <ListMusic className="w-5 h-5" />
            {queue.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-brand-action text-[10px] text-white flex items-center justify-center">
                {queue.length}
              </span>
            )}
          </button>

          {/* Desktop Volume Controls */}
          <div className="hidden lg:flex items-center gap-2 pl-1">
            <button
              type="button"
              onClick={toggleMute}
              className="w-8 h-8 flex items-center justify-center text-brand-text-secondary hover:text-brand-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
              aria-label={isMuted || volume === 0 ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-brand-text-secondary" />
              ) : (
                <Volume2 className="w-4 h-4 text-brand-text-secondary" />
              )}
            </button>

            <div className="relative w-20 flex items-center group py-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-brand-raised rounded-full appearance-none cursor-pointer focus:outline-none"
                aria-label="Volume slider"
              />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-accent rounded-full pointer-events-none group-hover:bg-brand-action transition-colors"
                style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      <QueuePanel />
    </div>
  );
}
