<script>
  import { onMount } from 'svelte'
  import GameForm from './lib/GameForm.svelte'
  import GameList from './lib/GameList.svelte'
  import ShareModal from './lib/ShareModal-Supabase.svelte'
  import ViewSharedList from './lib/ViewSharedList.svelte'
  import { getSharedListFromUrl } from './lib/shareUtils'
  import { getSharedSlugFromUrl, getGameListBySlug } from './lib/supabaseService'
  import Button from './lib/Button.svelte'

  let games = []
  let sharedGames = null
  let sharedMetadata = {}
  let isShareModalOpen = false
  let hasLoaded = false

  onMount(async () => {
    // Try to load from Supabase first (if slug in URL)
    const slug = getSharedSlugFromUrl()
    if (slug) {
      try {
        const result = await getGameListBySlug(slug)
        if (result && result.games && result.games.length > 0) {
          sharedGames = result.games
          sharedMetadata = result.metadata || {}
          hasLoaded = true
          return // Exit early, successfully loaded from Supabase
        }
      } catch (error) {
        console.error('Failed to load from Supabase:', error)
        // Fall through to legacy loading
      }
    }

    // Fallback: Try legacy URL encoding
    const shared = getSharedListFromUrl()
    if (shared && shared.games && shared.games.length > 0) {
      sharedGames = shared.games
      sharedMetadata = shared.metadata || {}
    }

    // Load games from localStorage if available
    const saved = localStorage.getItem('toptenGames')
    if (saved && !sharedGames) {
      try {
        games = JSON.parse(saved).map((game, idx) => ({
          ...game,
          id: game.id || Date.now() + idx
        }))
      } catch (e) {
        console.error('Failed to load saved games:', e)
      }
    }
    hasLoaded = true
  })

  $: if (hasLoaded) {
    localStorage.setItem('toptenGames', JSON.stringify(games))
  }

  const addGame = (newGame) => {
    games = [...games, { ...newGame, id: Date.now() }]
  }

  const reorderGame = ({ fromIndex, toIndex }) => {
    const newGames = [...games]
    const [game] = newGames.splice(fromIndex, 1)
    newGames.splice(toIndex, 0, game)
    games = newGames
  }

  const deleteGame = ({ id }) => {
    games = games.filter(game => game.id !== id)
  }

  const openShareModal = () => {
    isShareModalOpen = true
  }
</script>

<main>
  <div class="container">
    {#if sharedGames}
      <!-- View shared list mode -->
      <ViewSharedList games={sharedGames} metadata={sharedMetadata} />
    {:else}
      <!-- Editor mode -->
      <h1>🎮 Top Ten</h1>
      <p class="subtitle">Share your favorite games!</p>

      <div class="content">
        <div class="form-section">
          <GameForm onAddGame={addGame} />
        </div>

        <div class="list-section">
          {#if games.length === 0}
            <p class="empty-state">No games added yet. Start building your list!</p>
          {:else}
            <div class="list-header">
              <GameList {games} onReorderGame={reorderGame} onDeleteGame={deleteGame} />
              <Button onClick={openShareModal}>Share List</Button>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</main>

<ShareModal bind:isOpen={isShareModalOpen} {games} />

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, rgb(90, 78, 229) 0%, #3c69bf 100%);
    min-height: 100vh;
  }

  :global(h1) {
    font-family: "BBH Bartle", sans-serif;
  }

  :global(h2, h3, .author, .rank, .subtitle) {
    font-family: "BBH Hegarty", sans-serif;
    letter-spacing: 1px;
  }

  main {
    padding: 2rem 1rem;
    min-height: 100vh;
  }

  .container {
    max-width: 1000px;
    margin: 0 auto;
  }

  h1 {
    text-align: center;
    color: white;
    margin-bottom: 0.5rem;
    font-size: 2.5rem;
  }

  .subtitle {
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 2rem;
    font-size: 1.4rem;
  }

  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: flex-start;
  }

  .form-section {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    position: sticky;
    top: 2rem;
  }

  .list-section {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    min-height: 400px;
  }

  .list-header {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 1rem;
  }

  .empty-state {
    text-align: center;
    color: #999;
    padding: 2rem;
    font-style: italic;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.8rem;
    }

    .content {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .list-header {
      flex-direction: column-reverse;
    }
  }

  :global(.list-header .btn) {
    align-self: flex-start;
    margin-top: auto;
  }

  @media (max-width: 768px) {
    :global(.list-header .btn) {
      align-self: stretch;
    }

    .form-section {
      position: relative;
      top: 0;
    }
  }
</style>
