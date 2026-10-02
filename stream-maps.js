'use strict';
// Modified to bypass strict same-origin checks and allow remote map streaming
function streamedMapsGame(manifest) {
  if (!manifest || !Array.isArray(manifest.files) || !manifest.files.length || manifest.files.length > 256) {
    throw new Error('Invalid streamed map manifest.');
  }
  const names = new Set();
  let bytes = 0;
  for (const entry of manifest.files) {
    // MODIFIED: Changed the url validation check so it accepts absolute URLs from the original server
    if (!entry || !/^[a-z0-9_-]+\.map$/.test(entry.name) || names.has(entry.name) ||
        (entry.url !== '/downloaded-maps/' + entry.name && entry.url !== 'https://lolgames.net' + entry.name) ||
        !Number.isSafeInteger(entry.size) || entry.size < 2048) {
      throw new Error('Invalid streamed map entry.');
    }
    names.add(entry.name);
    bytes += entry.size;
    if (!Number.isSafeInteger(bytes)) throw new Error('Invalid streamed map size.');
  }
  if (!names.has('ui.map')) throw new Error('Streaming requires ui.map.');
  
  // MODIFIED: Directed dataRoot explicitly to the external server domain instead of a local folder path
  return { id: 'streamed', name: 'Downloaded Halo maps (streamed)',
    source: 'On demand · requires the hosting server', files: [...names], bytes,
    added: -1, path: ['streamed'], dataRoot: 'https://lolgames.net', streamed: true };
}
if (typeof module !== 'undefined') module.exports = { streamedMapsGame };
