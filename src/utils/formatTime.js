/**
 * Format seconds into mm:ss format (e.g., 222 -> "3:42")
 * @param {number} seconds
 * @returns {string}
 */
export function formatTime(seconds) {
  if (!seconds || isNaN(seconds) || seconds < 0) {
    return '0:00';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Format total seconds into a readable summary (e.g., "22 min" or "1 hr 12 min")
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatDurationSummary(totalSeconds) {
  if (!totalSeconds || isNaN(totalSeconds) || totalSeconds <= 0) {
    return '0 min';
  }
  const mins = Math.round(totalSeconds / 60);
  if (mins < 60) {
    return `${mins} min`;
  }
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours} hr ${remainingMins} min`;
}
