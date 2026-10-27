import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Pause, MoreVertical, Edit3, Trash2, ListMusic } from 'lucide-react';
import { useLibraryStore } from '../store/libraryStore';
import { usePlayerStore } from '../store/playerStore';
import { formatDurationSummary } from '../utils/formatTime';
import CreatePlaylistModal from '../components/CreatePlaylistModal';
import RenamePlaylistModal from '../components/RenamePlaylistModal';
import DeletePlaylistModal from '../components/DeletePlaylistModal';

export default function Playlists() {
  const navigate = useNavigate();
  const { playlists, createPlaylist, renamePlaylist, deletePlaylist } = useLibraryStore();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [playlistToRename, setPlaylistToRename] = useState(null);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const handlePlayPlaylist = (e, playlist) => {
    e.stopPropagation();
    if (!playlist.tracks || playlist.tracks.length === 0) {
      navigate(`/playlists/${playlist.id}`);
      return;
    }

    const isThisPlaylistPlaying = isPlaying && playlist.tracks.some((t) => t.id === currentTrack?.id);
    if (isThisPlaylistPlaying) {
      togglePlay();
    } else {
      playTrack(playlist.tracks[0], playlist.tracks);
    }
  };

  const handleCreateNew = (name, description) => {
    const newId = createPlaylist(name, description);
    navigate(`/playlists/${newId}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" aria-label="Playlists header">
        <div>
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-brand-accent">
            Made By You
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-text-primary mt-1">
            Your Playlists
          </h1>
          <p className="text-xs sm:text-sm text-brand-text-secondary mt-1">
            Every mood deserves a soundtrack.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block text-xs font-medium text-brand-text-secondary">
            {playlists.length} {playlists.length === 1 ? 'playlist' : 'playlists'}
          </span>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-control bg-brand-action hover:bg-brand-action-hover active:bg-brand-action-active text-white text-sm font-semibold flex items-center gap-2 shadow-soft transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>New playlist</span>
          </button>
        </div>
      </section>

      {/* 2. Grid of Playlists */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Playlists grid">
        {playlists.map((playlist) => {
          const totalDuration = playlist.tracks.reduce((sum, t) => sum + (t.duration || 0), 0);
          const isThisPlaylistPlaying = isPlaying && playlist.tracks.some((t) => t.id === currentTrack?.id);
          const isMenuOpen = openMenuId === playlist.id;

          return (
            <div
              key={playlist.id}
              onClick={() => navigate(`/playlists/${playlist.id}`)}
              className="group cursor-pointer rounded-card bg-brand-surface border border-brand-border/60 hover:border-brand-accent/40 p-4 transition-all duration-200 hover:shadow-soft flex flex-col justify-between relative"
              role="article"
              aria-label={`Playlist ${playlist.name}`}
            >
              {/* Cover Art with Hover Play Button */}
              <div className="relative aspect-video rounded-control overflow-hidden bg-brand-raised mb-4 select-none">
                <img
                  src={playlist.coverImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80'}
                  alt={playlist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Floating Play Button */}
                <button
                  type="button"
                  onClick={(e) => handlePlayPlaylist(e, playlist)}
                  className={`absolute bottom-3 right-3 w-10 h-10 rounded-control bg-brand-action hover:bg-brand-action-hover active:bg-brand-action-active text-white flex items-center justify-center shadow-soft transition-all duration-200 ${
                    isThisPlaylistPlaying
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 scale-95 group-hover:scale-100'
                  }`}
                  aria-label={isThisPlaylistPlaying ? `Pause ${playlist.name}` : `Play ${playlist.name}`}
                >
                  {isThisPlaylistPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>
              </div>

              {/* Title & Description */}
              <div className="space-y-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base text-brand-text-primary group-hover:text-brand-accent transition-colors truncate">
                    {playlist.name}
                  </h3>

                  {/* Options Menu Button (...) */}
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setOpenMenuId(isMenuOpen ? null : playlist.id)}
                      className="p-1 rounded-control text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-raised transition-colors"
                      aria-label="Playlist options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                      <div 
                        className="absolute right-0 top-full mt-1 z-30 w-36 rounded-card bg-brand-surface border border-brand-border shadow-soft py-1 text-xs animate-in fade-in duration-150"
                        onMouseLeave={() => setOpenMenuId(null)}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            setPlaylistToRename(playlist);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-brand-text-primary hover:bg-brand-raised text-left"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Rename</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            setPlaylistToDelete(playlist);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-brand-raised text-left"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-brand-text-secondary truncate leading-relaxed">
                  {playlist.description || 'Custom playlist'}
                </p>

                <div className="flex items-center gap-1.5 text-[11px] font-medium text-brand-text-secondary/70 pt-2">
                  <ListMusic className="w-3.5 h-3.5" />
                  <span>
                    {playlist.tracks.length} {playlist.tracks.length === 1 ? 'track' : 'tracks'} &middot; {formatDurationSummary(totalDuration)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. Footer Note matching Figma */}
      <div className="pt-8 border-t border-brand-border/40 text-xs text-brand-text-secondary select-none">
        <p>
          Your playlists are saved in this browser, on this device. All the music. None of the sign-up.
        </p>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreatePlaylistModal
          onCreate={handleCreateNew}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {playlistToRename && (
        <RenamePlaylistModal
          playlist={playlistToRename}
          onSave={(newName, newDesc) => renamePlaylist(playlistToRename.id, newName, newDesc)}
          onClose={() => setPlaylistToRename(null)}
        />
      )}

      {playlistToDelete && (
        <DeletePlaylistModal
          playlist={playlistToDelete}
          onConfirm={() => {
            deletePlaylist(playlistToDelete.id);
            setPlaylistToDelete(null);
          }}
          onCancel={() => setPlaylistToDelete(null)}
        />
      )}
    </div>
  );
}
