import axios from 'axios';
import { normalizeTrack, normalizeDeezerArtist } from '../utils/normalizeTrack';

/**
 * Route API calls through a same-origin proxy in development and production.
 */
const DEEZER_BASE_URL = '/api/deezer';

/**
 * Axios instance for Deezer API
 */
const deezerClient = axios.create({
  baseURL: DEEZER_BASE_URL,
  timeout: 10000,
});

/**
 * Search tracks on Deezer.
 * @param {string} query
 * @param {object} options
 * @returns {Promise<Array>} Normalized Deezer track metadata
 */
export async function searchTracks(query, { limit = 20, offset = 0 } = {}) {
  if (!query || !query.trim()) return [];
  const response = await deezerClient.get('/search', {
    params: { q: query.trim(), limit, index: offset, order: 'RANKING' },
  });
  return (response.data?.data || []).map(normalizeTrack).filter(Boolean);
}

export async function searchArtists(query, { limit = 10, offset = 0 } = {}) {
  if (!query || !query.trim()) return [];
  const response = await deezerClient.get('/search/artist', {
    params: { q: query.trim(), limit, index: offset },
  });
  return (response.data?.data || []).map(normalizeDeezerArtist).filter(Boolean);
}

export async function searchAlbums(query, { limit = 10, offset = 0 } = {}) {
  if (!query || !query.trim()) return [];
  const response = await deezerClient.get('/search/album', {
    params: { q: query.trim(), limit, index: offset },
  });
  return (response.data?.data || []).map(normalizeDeezerAlbum).filter(Boolean);
}

export async function getTrendingTracks({ limit = 10, offset = 0, tags } = {}) {
  if (tags && tags !== 'all') {
    return getTracksByGenre(tags, { limit, offset });
  }
  const response = await deezerClient.get('/chart/0/tracks', {
    params: { limit, index: offset },
  });
  return (response.data?.data || []).map(normalizeTrack).filter(Boolean);
}

export async function getNewReleases({ limit = 10, offset = 0 } = {}) {
  return getTrendingTracks({ limit, offset: offset + 8 });
}

export async function getGenres() {
  const response = await deezerClient.get('/genre');
  return (response.data?.data || []).filter((genre) => genre.id && genre.name);
}

export async function getTracksByGenre(genreId, { limit = 12, offset = 0 } = {}) {
  if (!genreId) return [];
  const response = await deezerClient.get(`/genre/${encodeURIComponent(genreId)}/artists`, {
    params: { limit: 5, index: offset },
  });
  const artists = response.data?.data || [];
  const artistTracks = await Promise.all(
    artists.map((artist) => getArtistTracks(artist.id, { limit: Math.ceil(limit / artists.length) || limit }))
  );
  const uniqueTracks = new Map();
  artistTracks.flat().forEach((track) => uniqueTracks.set(track.id, track));
  return Array.from(uniqueTracks.values()).slice(0, limit);
}

export async function getDeezerTrack(trackId) {
  const id = String(trackId || '').replace(/^deezer-/, '');
  if (!id) throw new Error('A Deezer track ID is required.');
  const response = await deezerClient.get(`/track/${encodeURIComponent(id)}`);
  const track = normalizeTrack(response.data);
  if (!track) throw new Error(`Deezer did not return track ${id}.`);
  return track;
}

export async function getAlbumTracks(albumId) {
  const id = String(albumId || '').replace(/^deezer-/, '');
  if (!id) return [];
  const response = await deezerClient.get(`/album/${encodeURIComponent(id)}/tracks`);
  return (response.data?.data || []).map(normalizeTrack).filter(Boolean);
}

export async function getArtistTracks(artistId, { limit = 10, offset = 0 } = {}) {
  const id = String(artistId || '').replace(/^deezer-/, '');
  if (!id) return [];
  const response = await deezerClient.get(`/artist/${encodeURIComponent(id)}/top`, {
    params: { limit, index: offset },
  });
  return (response.data?.data || []).map(normalizeTrack).filter(Boolean);
}

function normalizeDeezerAlbum(raw) {
  if (!raw) return null;
  return {
    id: String(raw.id),
    name: raw.title || 'Untitled Album',
    artistName: raw.artist?.name || 'Unknown Artist',
    artistId: raw.artist?.id ? String(raw.artist.id) : null,
    image: raw.cover_xl || raw.cover_big || raw.cover_medium || raw.cover || '',
    tracksCount: raw.nb_tracks || 0,
    shareUrl: raw.link || `https://www.deezer.com/album/${raw.id}`,
    source: 'deezer',
  };
}
