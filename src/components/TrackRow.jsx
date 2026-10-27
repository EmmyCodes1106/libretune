import React, { useState } from 'react';
import { Play, Pause, Heart, ListPlus, ExternalLink } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { useLibraryStore } from '../store/libraryStore';
import { formatTime } from '../utils/formatTime';
import AddToPlaylistModal from './AddToPlaylistModal';
import TrackActionsMenu from './TrackActionsMenu';

export default function TrackRow({ track, queueContext = [] }) {
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const { isFavorite, toggleFavorite, addRecentlyPlayed } = useLibraryStore();

  if (!track) return null;

  const isCurrent = currentTrack?.id === track.id;
  const isThisPlaying = isCurrent && isPlaying;
  const favorited = isFavorite(track.id);
  const isDeezer = track.source === 'deezer';
  const noPreview = isDeezer && track.hasPreview === false;

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (noPreview) return;
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, queueContext);
      addRecentlyPlayed(track);
    }
  };

  return (
    <>
      <div
        onClick={noPreview ? undefined : handlePlayClick}
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
            handlePlayClick(e);
          }
        }}
        aria-label={`${track.title} by ${track.artist}${noPreview ? ' (no preview available)' : isDeezer ? ' (preview)' : ''}`}
      >
        {/* Left: Play button, Cover & Title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={handlePlayClick}
            disabled={noPreview}
            title={noPreview ? 'No preview available' : undefined}
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

          <div className="relative shrink-0">
            <img
              src={track.artworkUrl}
              alt=""
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg object-cover bg-brand-raised shadow-sm"
              loading="lazy"
            />
            {/* Mini preview badge on artwork */}
            {isDeezer && (
              <span className="absolute -top-1 -right-1 px-1 rounded-full bg-amber-500 flex items-center justify-center text-[7px] font-bold text-white shadow-sm" title="Preview">
                P
              </span>
            )}
          </div>

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
              <span className={`shrink-0 text-[11px] font-medium ${
                isDeezer ? 'text-amber-400' : 'text-brand-text-secondary/80'
              }`}>
                {noPreview ? 'No preview available' : 'Preview'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Duration, Favorite, Add */}
        <div 
          className="flex items-center gap-2 sm:gap-3 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-xs font-medium text-brand-text-secondary hidden sm:inline-block w-10 text-right">
            {isDeezer && track.hasPreview ? '0:30' : formatTime(track.duration)}
          </span>

          <button
            type="button"
            onClick={() => toggleFavorite(track)}
            className={`p-2 rounded-control transition-colors ${
              favorited
                ? 'text-brand-accent'
                : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-raised'
            }`}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-brand-accent' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setShowPlaylistModal(true)}
            className="p-2 rounded-control text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-raised transition-colors"
            aria-label="Add to playlist"
          >
            <ListPlus className="w-4 h-4" />
          </button>
          <a
            href={track.shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-control px-2 py-1 text-[10px] font-semibold text-brand-accent hover:bg-brand-raised"
            aria-label={`Listen to ${track.title} on Deezer`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Listen on Deezer</span>
          </a>
          <TrackActionsMenu track={track} onAddToPlaylist={() => setShowPlaylistModal(true)} />
        </div>
      </div>

      {showPlaylistModal && (
        <AddToPlaylistModal
          track={track}
          onClose={() => setShowPlaylistModal(false)}
        />
      )}
    </>
  );
}
