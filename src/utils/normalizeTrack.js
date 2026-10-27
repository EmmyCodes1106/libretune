/**
 * Maps Deezer track data to LibreTune's playback and display fields.
 *
 * @param {object} raw
 * @returns {object|null} Normalized track
 */
export function normalizeTrack(raw) {
  if (!raw || !raw.id) return null;

  // Deezer provides album art at multiple sizes; prefer large (500x500)
  let artwork = '';
  if (raw.album) {
    artwork = raw.album.cover_xl || raw.album.cover_big || raw.album.cover_medium || raw.album.cover || '';
  }
  if (!artwork && raw.md5_image) {
    artwork = `https://e-cdns-images.dzcdn.net/images/cover/${raw.md5_image}/500x500-000000-80-0-0.jpg`;
  }
  if (!artwork) {
    artwork = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
  }

  return {
    id: String(raw.id),
    title: raw.title || raw.title_short || 'Untitled Track',
    artist: raw.artist?.name || 'Unknown Artist',
    artistId: raw.artist?.id ? String(raw.artist.id) : null,
    album: raw.album?.title || 'Single',
    albumId: raw.album?.id ? String(raw.album.id) : null,
    artworkUrl: artwork,
    audioUrl: raw.preview || '',
    duration: Number(raw.duration) || 0,
    hasPreview: Boolean(raw.preview),
    shareUrl: raw.link || `https://www.deezer.com/track/${raw.id}`,
    source: 'deezer',
  };
}

/**
 * Normalizes a Deezer API artist payload.
 *
 * @param {object} raw - Deezer artist object
 * @returns {object|null} Normalized artist or null
 */
export function normalizeDeezerArtist(raw) {
  if (!raw) return null;

  return {
    id: String(raw.id),
    deezerArtistId: String(raw.id),
    name: raw.name || 'Unknown Artist',
    genre: 'Artist',
    image: raw.picture_xl || raw.picture_big || raw.picture_medium || raw.picture ||
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    shareUrl: raw.link || `https://www.deezer.com/artist/${raw.id}`,
    source: 'deezer',
    nbFans: raw.nb_fan || 0,
  };
}
