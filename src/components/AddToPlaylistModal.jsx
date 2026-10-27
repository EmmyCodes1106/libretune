import React, { useState } from 'react';
import { X, Check, Plus } from 'lucide-react';
import { useLibraryStore } from '../store/libraryStore';

export default function AddToPlaylistModal({ track, onClose }) {
  const { playlists, addTrackToPlaylist, removeTrackFromPlaylist, createPlaylist } = useLibraryStore();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!track) return null;

  const handleToggle = (playlist) => {
    const isAdded = playlist.tracks.some((t) => t.id === track.id);
    if (isAdded) {
      removeTrackFromPlaylist(playlist.id, track.id);
    } else {
      addTrackToPlaylist(playlist.id, track);
    }
  };

  const handleCreateNew = (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    const newId = createPlaylist(newPlaylistName.trim());
    addTrackToPlaylist(newId, track);
    setNewPlaylistName('');
    setIsCreating(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Add to playlist"
    >
      <div 
        className="w-full max-w-sm rounded-card bg-brand-surface border border-brand-border p-5 shadow-soft space-y-4 text-brand-text-primary"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-brand-border/60 pb-3">
          <div className="min-w-0">
            <h3 className="font-bold text-base text-brand-text-primary truncate">
              Add to playlist
            </h3>
            <p className="text-xs text-brand-text-secondary truncate mt-0.5">
              {track.title} &middot; {track.artist}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-control text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-raised transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Playlist List */}
        <div className="max-h-60 overflow-y-auto space-y-1 py-1">
          {playlists.map((playlist) => {
            const isAdded = playlist.tracks.some((t) => t.id === track.id);
            return (
              <button
                key={playlist.id}
                type="button"
                onClick={() => handleToggle(playlist)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-control text-sm transition-all text-left min-h-[44px] ${
                  isAdded
                    ? 'bg-brand-raised text-brand-accent font-semibold'
                    : 'text-brand-text-primary hover:bg-brand-raised/50'
                }`}
              >
                <span className="truncate">{playlist.name}</span>
                {isAdded ? (
                  <Check className="w-4 h-4 text-brand-accent shrink-0 ml-2" />
                ) : (
                  <Plus className="w-4 h-4 text-brand-text-secondary shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Create new playlist toggle/form */}
        <div className="pt-2 border-t border-brand-border/60">
          {!isCreating ? (
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-control text-sm font-medium text-brand-accent hover:bg-brand-raised/50 transition-colors min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>Create new playlist</span>
            </button>
          ) : (
            <form onSubmit={handleCreateNew} className="space-y-2">
              <input
                type="text"
                autoFocus
                placeholder="Playlist name..."
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-control bg-brand-canvas border border-brand-border focus:border-brand-accent focus:outline-none"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 text-xs text-brand-text-secondary hover:text-brand-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newPlaylistName.trim()}
                  className="px-3 py-1.5 text-xs font-semibold rounded-control bg-brand-action text-white hover:bg-brand-action-hover disabled:opacity-50"
                >
                  Create & Add
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
