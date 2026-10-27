import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Edit3, 
  Trash2, 
  X, 
  ListPlus, 
  Search, 
  GripVertical 
} from 'lucide-react';
import { useLibraryStore } from '../store/libraryStore';
import { usePlayerStore } from '../store/playerStore';
import { formatTime, formatDurationSummary } from '../utils/formatTime';
import RenamePlaylistModal from '../components/RenamePlaylistModal';
import DeletePlaylistModal from '../components/DeletePlaylistModal';
import AddToPlaylistModal from '../components/AddToPlaylistModal';

export default function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playlists, renamePlaylist, deletePlaylist, removeTrackFromPlaylist, reorderPlaylistTracks } = useLibraryStore();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTrackForPlaylist, setActiveTrackForPlaylist] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const playlist = playlists.find((pl) => pl.id === id);

  if (!playlist) {
    return (
      <div className="space-y-4 py-8">
        <Link to="/playlists" className="text-xs text-brand-accent hover:underline flex items-center gap-1.5 font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to playlists</span>
        </Link>
        <div className="p-12 rounded-card bg-brand-surface border border-brand-border text-center space-y-3">
          <h2 className="text-xl font-bold text-brand-text-primary">Playlist not found</h2>
          <p className="text-xs text-brand-text-secondary">This playlist may have been deleted or does not exist.</p>
        </div>
      </div>
    );
  }

  const totalDuration = playlist.tracks.reduce((sum, t) => sum + (t.duration || 0), 0);
  const isPlaylistPlaying = isPlaying && playlist.tracks.some((t) => t.id === currentTrack?.id);

  const handlePlayAll = () => {
    if (playlist.tracks.length === 0) return;
    if (isPlaylistPlaying) {
      togglePlay();
    } else {
      const firstPlayable = playlist.tracks.find((track) => track.hasPreview !== false);
      if (firstPlayable) playTrack(firstPlayable, playlist.tracks);
    }
  };

  const handlePlayRow = (track) => {
    if (track.hasPreview === false) return;
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, playlist.tracks);
    }
  };

  // Drag and drop reordering
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    reorderPlaylistTracks(playlist.id, draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Breadcrumb navigation */}
      <Link 
        to="/playlists" 
        className="text-xs font-medium text-brand-text-secondary hover:text-brand-text-primary flex items-center gap-1.5 transition-colors select-none"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Your Playlists / {playlist.name}</span>
      </Link>

      {/* 2. Hero Header */}
      <section className="flex flex-col md:flex-row items-start md:items-center gap-6" aria-label="Playlist header">
        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-card overflow-hidden bg-brand-raised shrink-0 shadow-soft select-none">
          <img
            src={playlist.coverImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80'}
            alt={playlist.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3 min-w-0 flex-1">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-brand-accent">
            Your Playlist
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-text-primary truncate">
            {playlist.name}
          </h1>

          <p className="text-xs sm:text-sm text-brand-text-secondary max-w-xl leading-relaxed">
            {playlist.description || 'Custom playlist saved on this device.'}
          </p>

          <p className="text-xs font-medium text-brand-text-secondary/80">
            {playlist.tracks.length} {playlist.tracks.length === 1 ? 'track' : 'tracks'} &middot; {formatDurationSummary(totalDuration)} &middot; Saved on this device
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              disabled={
                playlist.tracks.length === 0 ||
                !playlist.tracks.some((track) => track.hasPreview !== false)
              }
              onClick={handlePlayAll}
              className="px-5 py-2.5 rounded-control bg-brand-action hover:bg-brand-action-hover active:bg-brand-action-active text-white text-sm font-semibold flex items-center gap-2 shadow-soft transition-all disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent min-h-[44px]"
            >
              {isPlaylistPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
              <span>{isPlaylistPlaying ? 'Pause' : 'Play all'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowRenameModal(true)}
              className="px-4 py-2.5 rounded-control bg-brand-surface border border-brand-border hover:bg-brand-raised text-brand-text-primary text-sm font-medium flex items-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent min-h-[44px]"
            >
              <Edit3 className="w-4 h-4" />
              <span>Rename</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="p-2.5 rounded-control bg-brand-surface border border-brand-border hover:bg-red-500/10 hover:border-red-500/30 text-brand-text-secondary hover:text-red-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent min-h-[44px]"
              aria-label="Delete playlist"
              title="Delete playlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. The Soundtrack Section */}
      <section className="space-y-4 pt-4" aria-label="Playlist tracks">
        <div className="flex items-center justify-between select-none">
          <h2 className="text-xl sm:text-2xl font-bold text-brand-text-primary">
            The soundtrack
          </h2>
          <span className="text-xs text-brand-text-secondary/70">
            Drag handles to reorder
          </span>
        </div>

        {playlist.tracks.length === 0 ? (
          <div className="p-10 rounded-card bg-brand-surface border border-brand-border/60 text-center space-y-4">
            <p className="text-sm text-brand-text-secondary">
              This playlist is currently empty. Add tracks from Search or Home!
            </p>
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="px-5 py-2.5 rounded-control bg-brand-action text-white text-sm font-semibold shadow-soft hover:bg-brand-action-hover"
            >
              Search music to add
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {playlist.tracks.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              const isThisPlaying = isCurrent && isPlaying;
              const isDragged = draggedIndex === idx;
              const noPreview = track.hasPreview === false;

              return (
                <div
                  key={`${track.id}-${idx}`}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  onClick={noPreview ? undefined : () => handlePlayRow(track)}
                  className={`group ${noPreview ? 'cursor-default' : 'cursor-pointer'} p-2.5 sm:p-3 rounded-control border transition-all duration-200 flex items-center justify-between gap-3 select-none ${
                    isDragged ? 'opacity-40 border-dashed border-brand-accent' : ''
                  } ${
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
                  {/* Left: Reorder Grip, Play, Artwork, Title & Artist */}
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                    {/* Drag Handle */}
                    <div 
                      className="cursor-grab active:cursor-grabbing p-1 text-brand-text-secondary/40 hover:text-brand-text-secondary transition-colors"
                      aria-label="Drag to reorder"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>

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

                  {/* Right: Duration, Remove from playlist, Add to another */}
                  <div 
                    className="flex items-center gap-2 sm:gap-3 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-xs font-medium text-brand-text-secondary hidden sm:inline-block w-10 text-right">
                      {noPreview ? 'Unavailable' : '0:30'}
                    </span>

                    {/* Remove from this playlist */}
                    <button
                      type="button"
                      onClick={() => removeTrackFromPlaylist(playlist.id, track.id)}
                      className="p-2 rounded-control text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-raised transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                      aria-label={`Remove ${track.title} from playlist`}
                      title="Remove from playlist"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Add to another playlist */}
                    <button
                      type="button"
                      onClick={() => setActiveTrackForPlaylist(track)}
                      className="p-2 rounded-control text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-raised transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                      aria-label="Add to another playlist"
                      title="Add to another playlist"
                    >
                      <ListPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Bottom Discovery Callout (matching Figma mockup) */}
      <section 
        className="p-5 sm:p-6 rounded-card bg-brand-surface border border-brand-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none"
        aria-label="Find music callout"
      >
        <div className="space-y-1">
          <h3 className="font-bold text-base text-brand-text-primary">
            Make room for another favorite.
          </h3>
          <p className="text-xs sm:text-sm text-brand-text-secondary">
            Find a track and use the add-to-playlist control to keep the night going.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/search')}
          className="px-5 py-2.5 rounded-control bg-brand-surface border border-brand-border hover:border-brand-accent hover:bg-brand-raised text-brand-text-primary text-sm font-semibold flex items-center gap-2 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent shrink-0 min-h-[44px]"
        >
          <Search className="w-4 h-4" />
          <span>Find music</span>
        </button>
      </section>

      {/* Modals */}
      {showRenameModal && (
        <RenamePlaylistModal
          playlist={playlist}
          onSave={(newName, newDesc) => renamePlaylist(playlist.id, newName, newDesc)}
          onClose={() => setShowRenameModal(false)}
        />
      )}

      {showDeleteModal && (
        <DeletePlaylistModal
          playlist={playlist}
          onConfirm={() => {
            deletePlaylist(playlist.id);
            navigate('/playlists');
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {activeTrackForPlaylist && (
        <AddToPlaylistModal
          track={activeTrackForPlaylist}
          onClose={() => setActiveTrackForPlaylist(null)}
        />
      )}
    </div>
  );
}
