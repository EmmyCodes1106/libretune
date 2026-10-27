import React, { useState } from 'react';
import { Play, Pause, Heart, ListPlus, ExternalLink } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { useLibraryStore } from '../store/libraryStore';
import { formatTime } from '../utils/formatTime';
import AddToPlaylistModal from './AddToPlaylistModal';
import TrackActionsMenu from './TrackActionsMenu';

export default function TrackCard({ track, queueContext = [] }) {
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
      <article
        onClick={handlePlayClick}
        className={`group ${noPreview ? 'cursor-default' : 'cursor-pointer'} rounded-card bg-brand-surface border transition-all duration-200 p-3.5 flex flex-col justify-between hover:shadow-soft ${
          isCurrent 
            ? 'border-brand-accent/60 bg-brand-raised/40 ring-1 ring-brand-accent/40' 
            : 'border-brand-border/60 hover:border-brand-border'
        }`}
        aria-label={`${track.title} by ${track.artist}${noPreview ? ' (no preview available)' : isDeezer ? ' (preview)' : ''}`}
      >
        {/* Artwork with Hover Play Trigger */}
        <div className="relative aspect-square w-full rounded-control overflow-hidden bg-brand-raised mb-3 select-none">
          <img
            src={track.artworkUrl}
            alt={`${track.title} cover`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* 30s Preview Badge (Deezer tracks) */}
          {isDeezer && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-500/90 text-white shadow-sm backdrop-blur-sm">
              Preview
            </span>
          )}

          {/* Gradient shadow for play button contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Play/Pause Button on Artwork (Figma specimen style) */}
          <button
            type="button"
            onClick={handlePlayClick}
            disabled={noPreview}
            title={noPreview ? 'No preview available' : undefined}
            className={`absolute bottom-2.5 right-2.5 w-10 h-10 rounded-control bg-brand-action hover:bg-brand-action-hover active:bg-brand-action-active text-white flex items-center justify-center shadow-soft transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
              isThisPlaying || isCurrent
                ? 'opacity-100 scale-100'
                : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 scale-95 group-hover:scale-100'
            }`}
            aria-label={noPreview ? 'No preview available' : isThisPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
          >
            {isThisPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Track Metadata */}
        <div className="space-y-1 min-w-0">
          <h3 
            className={`font-bold text-sm truncate transition-colors ${
              isCurrent ? 'text-brand-accent' : 'text-brand-text-primary group-hover:text-brand-accent'
            }`}
          >
            {track.title}
          </h3>
          <p className="text-xs text-brand-text-secondary truncate">
            {track.artist}
          </p>

          <div className="flex items-center justify-between text-[11px] text-brand-text-secondary/80 pt-1">
            <span className={`font-medium px-1.5 py-0.5 rounded border border-brand-border/40 ${
              isDeezer 
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' 
                : 'bg-brand-raised text-brand-text-secondary'
            }`}>
              {noPreview ? 'No preview available' : 'Preview'}
            </span>
            <span>{isDeezer && track.hasPreview ? '0:30' : formatTime(track.duration)}</span>
          </div>
        </div>

        {/* Action Controls Row */}
        <div 
          className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-brand-border/40"
          onClick={(e) => e.stopPropagation()}
        >
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
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-accent hover:underline"
            aria-label={`Listen to ${track.title} on Deezer`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Listen on Deezer</span>
          </a>
          <TrackActionsMenu track={track} onAddToPlaylist={() => setShowPlaylistModal(true)} />
        </div>
      </article>

      {showPlaylistModal && (
        <AddToPlaylistModal
          track={track}
          onClose={() => setShowPlaylistModal(false)}
        />
      )}
    </>
  );
}
