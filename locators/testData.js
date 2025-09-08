/**
 * Target data. Update names and idSuffixes to match the environment.
 * Where possible, the Page Objects will use specific test-ids
 * (e.g., app-tile-${idSuffix}); otherwise they fall back to text.
 */
module.exports = {
  deletableApp:     { name: 'YouTube',  idSuffix: 'youtube' },
  nonDeletableApp:  { name: 'Watch TV', idSuffix: 'watch-tv' },
  appToAdd:         { name: 'Spotify',  idSuffix: 'spotify' },
  searchCategory:   { name: 'Movies',   idSuffix: 'movies' }
};