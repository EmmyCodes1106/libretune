import React from 'react';
import { Trash2 } from 'lucide-react';

export default function DeletePlaylistModal({ playlist, onConfirm, onCancel }) {
  if (!playlist) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 select-none"
      role="alertdialog"
      aria-modal="true"
      aria-label="Delete playlist confirmation"
    >
      <div className="w-full max-w-md rounded-card bg-brand-surface border border-brand-border p-6 shadow-soft space-y-5 text-brand-text-primary">
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold text-brand-text-primary tracking-tight">
            Delete {playlist.name}?
          </h3>
          <p className="text-xs sm:text-sm text-brand-text-secondary leading-relaxed">
            This removes the playlist from this device. The music is still yours to discover again.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-control bg-brand-action hover:bg-brand-action-hover active:bg-brand-action-active text-white text-sm font-semibold flex items-center gap-2 shadow-soft transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent min-h-[44px]"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete playlist</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-control bg-brand-raised hover:bg-brand-raised/80 text-brand-text-primary text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent min-h-[44px]"
          >
            Keep playlist
          </button>
        </div>
      </div>
    </div>
  );
}
