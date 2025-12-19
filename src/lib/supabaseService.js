import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
// These values come from your .env.local file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. URL sharing will use client-side encoding.')
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

/**
 * Generate a short, readable slug (6 characters)
 * Format: lowercase letters and numbers
 */
export function generateSlug() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let slug = ''
  for (let i = 0; i < 6; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return slug
}

/**
 * Check if a slug already exists
 */
export async function slugExists(slug) {
  if (!supabase) return false
  
  try {
    const { count } = await supabase
      .from('game_lists')
      .select('id', { count: 'exact', head: true })
      .eq('slug', slug)
    
    return count > 0
  } catch (error) {
    console.error('Error checking slug:', error)
    return false
  }
}

/**
 * Generate a unique slug
 */
export async function generateUniqueSlug() {
  let slug = generateSlug()
  let attempts = 0
  
  while (await slugExists(slug) && attempts < 10) {
    slug = generateSlug()
    attempts++
  }
  
  return slug
}

/**
 * Save a game list to Supabase
 * Returns the slug if successful, null if failed
 */
export async function saveGameList(games, metadata) {
  if (!supabase) {
    console.error('Supabase not configured')
    return null
  }
  
  try {
    const slug = await generateUniqueSlug()
    
    const { data, error } = await supabase
      .from('game_lists')
      .insert({
        slug,
        title: metadata.title || 'My Top 10 Games',
        author: metadata.author || 'Anonymous',
        games
      })
      .select('slug')
    
    if (error) {
      console.error('Error saving list:', error)
      return null
    }
    
    return slug
  } catch (error) {
    console.error('Error saving game list:', error)
    return null
  }
}

/**
 * Fetch a game list by slug
 * Returns { games: [], metadata: { title, author } } or null if not found
 */
export async function getGameListBySlug(slug) {
  if (!supabase) {
    console.error('Supabase not configured')
    return null
  }
  
  try {
    const { data, error } = await supabase
      .from('game_lists')
      .select('games, title, author, view_count')
      .eq('slug', slug)
      .single()
    
    if (error) {
      console.error('Error fetching list:', error)
      return null
    }
    
    if (!data) return null
    
    // Increment view count in background (don't wait for it)
    supabase
      .from('game_lists')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('slug', slug)
      .then()
      .catch(err => console.error('Error updating view count:', err))
    
    return {
      games: data.games || [],
      metadata: {
        title: data.title,
        author: data.author
      }
    }
  } catch (error) {
    console.error('Error fetching game list:', error)
    return null
  }
}

/**
 * Generate a share URL for a slug
 */
export function getShareUrl(slug) {
  const baseUrl = window.location.origin + window.location.pathname
  return `${baseUrl}?share=${slug}`
}

/**
 * Get slug from URL (if present)
 * Returns slug or null
 */
export function getSharedSlugFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return params.get('share')
}
