'use strict';

function streamedMapsGame(manifest) {
  if (!manifest || !Array.isArray(manifest.files) || !manifest.files.length || manifest.files.length > 256) {
    throw new Error('Invalid streamed map manifest.');
  }
  
  // 🟢 CHANGE THESE TO MATCH YOUR EXACT REPOSITORY DETAILS
  const githubUsername = "NationNook";
  const mapsRepoName = "Angel-Space-Maps1"; 
  const branchName = "main"; // Usually 'main' or 'master'

  // The official GitHub raw assets URL endpoint (handles CORS out of the box)
  const rawGitHubUrl = `https://githubusercontent.com{githubUsername}/${mapsRepoName}/${branchName}/`;

  const names = new Set();
  let bytes = 0;
  for (const entry of manifest.files) {
    // Bypasses the strict original local directory restrictions
    if (!entry || !/^[a-z0-9_-]+\.map\$/.test(entry.name) || names.has(entry.name) ||
        !Number.isSafeInteger(entry.size) || entry.size < 2048) {
      throw new Error('Invalid streamed map entry.');
    }
    names.add(entry.name);
    bytes += entry.size;
    if (!Number.isSafeInteger(bytes)) throw new Error('Invalid streamed map size.');
  }
  if (!names.has('ui.map')) throw new Error('Streaming requires ui.map.');
  
  return { 
    id: 'streamed', 
    name: 'Downloaded Halo maps (streamed)',
    source: 'On demand · Streaming directly from GitHub Repo Storage', 
    files: [...names], 
    bytes,
    added: -1, 
    path: ['streamed'], 
    // Feeds the engine your exact raw usercontent file routes
    dataRoot: rawGitHubUrl, 
    streamed: true 
  };
}

if (typeof module !== 'undefined') module.exports = { streamedMapsGame };
