import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function RenamePlaylistModal({ playlist, onSave, onClose }) {
  const [name, setName] = useState(playlist?.name || '');
  const [description, setDescription] = useState(playlist?.description || '');

  if (!playlist) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim(), description.trim());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Rename playlist"
    >
      <div className="w-full max-w-md rounded-card bg-brand-surface border border-brand-border p-6 shadow-soft space-y-5 text-brand-text-primary">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-brand-text-primary tracking-tight">
              Rename playlist
            </h3>
            <p className="text-xs text-brand-text-secondary">
              Give this soundtrack a new name.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-control text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-raised transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="playlist-name-input" className="text-xs font-semibold text-brand-text-secondary">
              Playlist Name
            </label>
            <input
              id="playlist-name-input"
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-control bg-brand-canvas border border-brand-border focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20 text-sm text-brand-text-primary"
              placeholder="e.g. Late Night Vibes"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="playlist-desc-input" className="text-xs font-semibold text-brand-text-secondary">
              Description (optional)
            </label>
            <textarea
              id="playlist-desc-input"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-control bg-brand-canvas border border-brand-border focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20 text-xs text-brand-text-primary resize-none"
              placeholder="Brief description of this collection..."
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-5 py-2.5 rounded-control bg-brand-action hover:bg-brand-action-hover active:bg-brand-action-active text-white text-sm font-semibold shadow-soft transition-all disabled:opacity-50 min-h-[44px]"
            >
              Save name
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-control bg-brand-surface border border-brand-border hover:bg-brand-raised text-brand-text-secondary hover:text-brand-text-primary text-sm font-medium transition-colors min-h-[44px]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
