import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, ExternalLink, GripVertical, Trash2, X } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';

export default function QueuePanel() {
  const {
    currentTrack,
    queue,
    isQueuePanelOpen,
    setQueuePanelOpen,
    removeFromQueue,
    clearQueue,
    reorderQueue,
    stopCurrentTrack,
  } = usePlayerStore();
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    if (!isQueuePanelOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setQueuePanelOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isQueuePanelOpen, setQueuePanelOpen]);

  if (!isQueuePanelOpen) return null;

  const moveTrack = (index, offset) => reorderQueue(index, index + offset);

  return (
    <section
      role="dialog"
      aria-modal="false"
      id="queue-panel"
      aria-label="Queue"
      className="fixed bottom-28 right-3 sm:right-6 z-40 w-[min(24rem,calc(100vw-1.5rem))] max-h-[min(70vh,38rem)] overflow-hidden rounded-card border border-brand-border bg-brand-surface shadow-soft flex flex-col"
    >
      <header className="flex items-center justify-between gap-3 p-4 border-b border-brand-border/60">
        <div>
          <h2 className="font-bold text-brand-text-primary">Queue</h2>
          <p className="text-xs text-brand-text-secondary">{queue.length} upcoming</p>
        </div>
        <div className="flex items-center gap-1">
          {queue.length > 0 && (
            <button
              type="button"
              onClick={clearQueue}
              className="p-2 rounded-control text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-raised"
              aria-label="Clear queue"
              title="Clear queue"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setQueuePanelOpen(false)}
            className="p-2 rounded-control text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-raised"
            aria-label="Close queue"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="overflow-y-auto p-3 space-y-4">
        <section aria-label="Now playing">
          <h3 className="px-1 pb-2 text-xs font-bold uppercase tracking-wide text-brand-text-secondary">Now playing</h3>
          {currentTrack ? (
            <div className="flex items-center gap-3 rounded-control bg-brand-raised/50 p-2.5">
              <img src={currentTrack.artworkUrl} alt="" className="w-11 h-11 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-brand-text-primary">{currentTrack.title}</p>
                <p className="truncate text-xs text-brand-text-secondary">{currentTrack.artist}</p>
              </div>
              <a
                href={currentTrack.shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-brand-text-secondary hover:text-brand-accent"
                aria-label={`Listen to ${currentTrack.title} on Deezer`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={stopCurrentTrack}
                className="p-2 text-brand-text-secondary hover:text-red-400"
                aria-label={`Stop ${currentTrack.title}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <p className="rounded-control bg-brand-raised/50 p-3 text-xs text-brand-text-secondary">Nothing playing</p>
          )}
        </section>

        <section aria-label="Next up">
          <h3 className="px-1 pb-2 text-xs font-bold uppercase tracking-wide text-brand-text-secondary">Next up</h3>
          {queue.length === 0 ? (
            <p className="rounded-control bg-brand-raised/50 p-3 text-xs text-brand-text-secondary">Queue is empty</p>
          ) : (
            <ol className="space-y-1">
              {queue.map((track, index) => (
                <li
                  key={`${track.id}-${index}`}
                  draggable
                  onDragStart={() => setDraggedIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (draggedIndex !== null) reorderQueue(draggedIndex, index);
                    setDraggedIndex(null);
                  }}
                  onDragEnd={() => setDraggedIndex(null)}
                  onKeyDown={(event) => {
                    if (event.altKey && event.key === 'ArrowUp') {
                      event.preventDefault();
                      moveTrack(index, -1);
                    }
                    if (event.altKey && event.key === 'ArrowDown') {
                      event.preventDefault();
                      moveTrack(index, 1);
                    }
                  }}
                  className={`flex items-center gap-2 rounded-control border border-transparent p-2 hover:bg-brand-raised/50 focus-within:border-brand-accent ${
                    draggedIndex === index ? 'opacity-40' : ''
                  }`}
                  aria-label={`${track.title}, position ${index + 1} of ${queue.length}. Use Alt and arrow keys to reorder.`}
                >
                  <GripVertical className="w-4 h-4 shrink-0 text-brand-text-secondary/60" aria-hidden="true" />
                  <img src={track.artworkUrl} alt="" className="w-10 h-10 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-brand-text-primary">{track.title}</p>
                    <p className="truncate text-xs text-brand-text-secondary">{track.artist}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => moveTrack(index, -1)}
                    disabled={index === 0}
                    className="p-1.5 text-brand-text-secondary hover:text-brand-text-primary disabled:opacity-30"
                    aria-label={`Move ${track.title} up in queue`}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveTrack(index, 1)}
                    disabled={index === queue.length - 1}
                    className="p-1.5 text-brand-text-secondary hover:text-brand-text-primary disabled:opacity-30"
                    aria-label={`Move ${track.title} down in queue`}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromQueue(track.id)}
                    className="p-1.5 text-brand-text-secondary hover:text-red-400"
                    aria-label={`Remove ${track.title} from queue`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </section>
  );
}
