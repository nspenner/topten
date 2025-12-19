# Supabase Backend Integration Guide

This branch adds Supabase backend support for shorter, more shareable URLs.

## What Changed

### New Files Created:
- `src/lib/supabaseService.js` - Supabase client and API functions
- `src/lib/ShareModal-Supabase.svelte` - Enhanced ShareModal with backend support
- `.env.local.example` - Environment variable template
- `SUPABASE_SETUP.md` - Supabase setup instructions

### New Package:
- `@supabase/supabase-js` - Supabase client library

## How to Enable Supabase

### 1. Set Up Supabase (5 minutes)

Follow `SUPABASE_SETUP.md` to:
- Create a Supabase account and project
- Create the `game_lists` table with the provided SQL
- Copy your credentials

### 2. Configure Environment Variables

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

(Use `.env.local.example` as a template)

### 3. Update App.svelte to Use New ShareModal

**Replace:**
```svelte
import ShareModal from './lib/ShareModal.svelte'
```

**With:**
```svelte
import ShareModal from './lib/ShareModal-Supabase.svelte'
```

### 4. Handle Shared Links

In `src/App.svelte`, update the reactive logic that loads shared lists:

**Find this section** (around line 40-50 in App.svelte):
```svelte
onMount(() => {
  const sharedData = getSharedListFromUrl()
  if (sharedData) {
    // load shared list...
  }
})
```

**Replace with:**
```svelte
import { getSharedSlugFromUrl, getGameListBySlug } from './lib/supabaseService'

onMount(async () => {
  // Try to load from Supabase first
  const slug = getSharedSlugFromUrl()
  if (slug) {
    const result = await getGameListBySlug(slug)
    if (result) {
      games = result.games
      showSharedView = true
      return
    }
  }
  
  // Fallback to legacy URL encoding
  const sharedData = getSharedListFromUrl()
  if (sharedData) {
    games = sharedData.games
    showSharedView = true
  }
})
```

## How It Works

### Sharing a List:

1. User clicks "Share"
2. Modal shows metadata form (title, author)
3. User clicks "Generate Share Link"
4. App saves list to Supabase with a unique 6-char slug
5. Returns a short URL like: `yoursite.com/?share=abc123`
6. User copies and shares the short link

### Viewing a Shared List:

1. Someone opens the shared link with `?share=abc123`
2. App reads the slug from URL
3. Fetches the list data from Supabase
4. Displays the shared view (read-only)

## Fallback Behavior

If Supabase is not configured:
- App automatically falls back to legacy URL encoding
- Shares still work but URLs are longer
- User sees a warning in the modal

## Benefits

| Feature | Legacy (URL Encoding) | Supabase |
|---------|----------------------|----------|
| URL Length | 500+ characters | ~30 characters |
| Storage | Browser only | Database |
| Tracking | No | View count support |
| Reliability | Dependent on URL length | Guaranteed |
| Scalability | Limited | Unlimited |

## Optional: Load Shared List in ViewSharedList

Update `src/lib/ViewSharedList.svelte` to accept slug instead of games:

```svelte
<script>
  import { getGameListBySlug } from './supabaseService'
  
  export let slug = null
  export let games = []
  export let metadata = {}
  
  onMount(async () => {
    if (slug) {
      const result = await getGameListBySlug(slug)
      if (result) {
        games = result.games
        metadata = result.metadata
      }
    }
  })
</script>
```

## Debugging

Check the browser console for:
- "Supabase credentials not configured" - environment variables not set
- "Error saving list" or "Error fetching list" - database issues
- "Failed to generate share link" - network or permission issues

## Next Steps (Optional)

- Add user authentication to let users manage their lists
- Show list statistics (view count, creation date)
- Add ability to delete/edit saved lists
- Create a "gallery" page to browse popular lists
