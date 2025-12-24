import pako from 'pako'

/**
 * Minify data by using short field names
 * t=title, g=games, d=description, u=url, s=screenshot
 */
function minifyData(games, metadata) {
  return {
    t: metadata.title || 'My Top 10 Games',
    g: games.map(game => ({
      t: game.title,
      d: game.description,
      u: game.url || '',
      s: game.screenshot || ''
    }))
  }
}

/**
 * Unminiify data by converting short field names back to full names
 */
function unminifyData(data) {
  return {
    title: data.t,
    games: Array.isArray(data.g) ? data.g.map(game => ({
      title: game.t,
      description: game.d,
      url: game.u,
      screenshot: game.s
    })) : []
  }
}

/**
 * Encode games array and metadata into a deflate-compressed URL-safe string
 */
export function encodeGames(games, metadata = {}) {
  const minified = minifyData(games, metadata)
  const json = JSON.stringify(minified)
  const compressed = pako.deflate(json)
  
  // Convert to base64url for URL safety
  let binary = ''
  for (let i = 0; i < compressed.length; i++) {
    binary += String.fromCharCode(compressed[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

/**
 * Decode games and metadata from URL parameter
 * Returns { games: [], metadata: { title } }
 */
export function decodeGames(encoded) {
  try {
    if (!encoded) return { games: [], metadata: {} }
    
    // Convert from base64url back to binary
    let binary = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'))
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    
    const decompressed = pako.inflate(bytes, { to: 'string' })
    const data = JSON.parse(decompressed)
    
    // Handle minified format
    if (data.g) {
      const unminified = unminifyData(data)
      return {
        games: unminified.games,
        metadata: {
          title: unminified.title
        }
      }
    }
    
    // Handle old format for backwards compatibility
    if (Array.isArray(data)) {
      return { games: data, metadata: {} }
    }
    
    // Fallback to old object format
    return {
      games: Array.isArray(data.games) ? data.games : [],
      metadata: {
        title: data.title || 'My Top 10 Games'
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
 * Returns { games: [], metadata: { title } } or null
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
