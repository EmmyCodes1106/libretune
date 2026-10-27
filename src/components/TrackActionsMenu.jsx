import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Heart, ListPlus, MoreVertical, Play } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { useLibraryStore } from '../store/libraryStore';

export default function TrackActionsMenu({ track, onAddToPlaylist }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const { queue, playTrack, playNext, addToQueue } = usePlayerStore();
  const { isFavorite, toggleFavorite } = useLibraryStore();
  const favorited = isFavorite(track.id);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    menuRef.current?.querySelector('button')?.focus();
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const runAction = (action) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen((open) => !open);
        }}
        className="p-2 rounded-control text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-raised transition-colors"
        aria-label={`More actions for ${track.title}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={`Actions for ${track.title}`}
          className="absolute right-0 bottom-full z-50 mb-2 w-52 rounded-control border border-brand-border bg-brand-surface p-1.5 shadow-soft"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => {
            const items = Array.from(menuRef.current.querySelectorAll('[role="menuitem"]'));
            const currentIndex = items.indexOf(document.activeElement);
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              const direction = event.key === 'ArrowDown' ? 1 : -1;
              items[(currentIndex + direction + items.length) % items.length]?.focus();
            } else if (event.key === 'Home' || event.key === 'End') {
              event.preventDefault();
              items[event.key === 'Home' ? 0 : items.length - 1]?.focus();
            }
          }}
        >
          <button
            role="menuitem"
            type="button"
            onClick={() => runAction(() => playTrack(track, queue.filter((queuedTrack) => queuedTrack.id !== track.id)))}
            className={menuItemClass}
          >
            <Play className="w-4 h-4" /> Play now
          </button>
          <button role="menuitem" type="button" onClick={() => runAction(() => playNext(track))} className={menuItemClass}>
            <ListPlus className="w-4 h-4" /> Play next
          </button>
          <button role="menuitem" type="button" onClick={() => runAction(() => addToQueue(track))} className={menuItemClass}>
            <ListPlus className="w-4 h-4" /> Add to queue
          </button>
          <button
            role="menuitem"
            type="button"
            onClick={() => runAction(() => onAddToPlaylist?.())}
            className={menuItemClass}
          >
            <ListPlus className="w-4 h-4" /> Add to playlist
          </button>
          <button role="menuitem" type="button" onClick={() => runAction(() => toggleFavorite(track))} className={menuItemClass}>
            <Heart className={`w-4 h-4 ${favorited ? 'fill-brand-accent text-brand-accent' : ''}`} />
            {favorited ? 'Remove from favorites' : 'Add to favorites'}
          </button>
          <a
            role="menuitem"
            href={track.shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className={menuItemClass}
          >
            <ExternalLink className="w-4 h-4" /> Listen on Deezer
          </a>
        </div>
      )}
    </div>
  );
}

const menuItemClass = 'flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-xs font-medium text-brand-text-primary hover:bg-brand-raised focus:bg-brand-raised focus:outline-none';
