import LZ from 'lz-string'

/**
 * Encode games array and metadata into a compressed URL-safe string
 */
export function encodeGames(games, metadata = {}) {
  const data = {
    title: metadata.title || 'My Top 10 Games',
    author: metadata.author || 'Anonymous',
    games: games.map(game => ({
      title: game.title,
      description: game.description,
      url: game.url || '',
      screenshot: game.screenshot || ''
    }))
  }
  
  const json = JSON.stringify(data)
  return LZ.compressToEncodedURIComponent(json)
}

/**
 * Decode games and metadata from URL parameter
 * Returns { games: [], metadata: { title, author } }
 */
export function decodeGames(encoded) {
  try {
    const json = LZ.decompressFromEncodedURIComponent(encoded)
    if (!json) return { games: [], metadata: {} }
    
    const data = JSON.parse(json)
    
    // Handle old format (array) for backwards compatibility
    if (Array.isArray(data)) {
      return { games: data, metadata: {} }
    }
    
    // Handle new format (object with metadata)
    return {
      games: Array.isArray(data.games) ? data.games : [],
      metadata: {
        title: data.title || 'My Top 10 Games',
        author: data.author || 'Anonymous'
      }
    }
  } catch (e) {
    console.error('Failed to decode shared list:', e)
    return { games: [], metadata: {} }
  }
}

/**
 * Get share URL with encoded games and metadata
 */
export function getShareUrl(games, metadata = {}) {
  const encoded = encodeGames(games, metadata)
  const baseUrl = window.location.origin + window.location.pathname
  return `${baseUrl}?list=${encoded}`
}

/**
 * Check if URL has a shared list
 * Returns { games: [], metadata: { title, author } } or null
 */
export function getSharedListFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const encoded = params.get('list')
  
  if (encoded) {
    const result = decodeGames(encoded)
    return result.games.length > 0 ? result : null
  }
  
  return null
}
