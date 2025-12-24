<script>
  import { onMount } from 'svelte'
  import GameForm from './lib/GameForm.svelte'
  import GameList from './lib/GameList.svelte'
  import ShareModal from './lib/ShareModal-Supabase.svelte'
  import PrivacyModal from './lib/PrivacyModal.svelte'
  import ViewSharedList from './lib/ViewSharedList.svelte'
  import { getSharedListFromUrl } from './lib/shareUtils'
  import { getSharedSlugFromUrl, getGameListBySlug } from './lib/supabaseService'
  import Button from './lib/Button.svelte'

  let games = []
  let sharedGames = null
  let sharedMetadata = {}
  let isShareModalOpen = false
  let isPrivacyModalOpen = false
  let hasLoaded = false
  let isInitialLoading = false

  onMount(async () => {
    const slug = getSharedSlugFromUrl()
    const legacyShared = getSharedListFromUrl()
    
    if (slug || legacyShared) {
      isInitialLoading = true
    }

    // Try to load from Supabase first (if slug in URL)
    if (slug) {
      try {
        const result = await getGameListBySlug(slug)
        if (result && result.games && result.games.length > 0) {
          sharedGames = result.games
          sharedMetadata = result.metadata || {}
          isInitialLoading = false
          hasLoaded = true
          return // Exit early, successfully loaded from Supabase
        }
      } catch (error) {
        console.error('Failed to load from Supabase:', error)
        // Fall through to legacy loading
      }
    }

    // Fallback: Try legacy URL encoding
    if (legacyShared && legacyShared.games && legacyShared.games.length > 0) {
      sharedGames = legacyShared.games
      sharedMetadata = legacyShared.metadata || {}
    }

    isInitialLoading = false

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
    {#if isInitialLoading}
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Loading shared list...</p>
      </div>
    {:else if sharedGames}
      <!-- View shared list mode -->
      <ViewSharedList games={sharedGames} metadata={sharedMetadata} />
    {:else}
      <!-- Editor mode -->
      <h1>Top Ten</h1>
      <p class="subtitle">Share your favorite games!</p>
      <p class="note">(You can share more than 10 if you want)</p>

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

<footer>
  <p>
    made by <a href="https://nathanminchow.com" target="_blank" rel="noopener noreferrer">nathan minchow</a> 
    | <button class="link-btn" on:click={() => isPrivacyModalOpen = true}>privacy policy</button>
  </p>
</footer>

<ShareModal bind:isOpen={isShareModalOpen} {games} />
<PrivacyModal bind:isOpen={isPrivacyModalOpen} />

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, rgb(90, 78, 229) 0%, #3c69bf 100%);
    min-height: 100vh;
  }

  :global(#app) {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  :global(h1) {
    font-family: "BBH Bartle", sans-serif;
  }

  :global(h2, h3, .rank, .subtitle) {
    font-family: "BBH Hegarty", sans-serif;
    letter-spacing: 1px;
  }

  main {
    padding: 2rem 1rem;
    flex: 1;
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

  .note {
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
    margin-top: -2rem;
    margin-bottom: 2rem;
    font-size: 0.9rem;
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

  .kofi-section {
    margin-top: 1.5rem;
    display: flex;
    justify-content: center;
    border-top: 1px solid #eee;
    padding-top: 1.5rem;
  }

  .kofi-section img {
    height: 36px;
    transition: transform 0.2s;
  }

  .kofi-section img:hover {
    transform: scale(1.05);
  }

  footer {
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }

  footer a {
    color: white;
    text-decoration: none;
    font-weight: 600;
  }

  footer a:hover {
    text-decoration: underline;
  }

  .link-btn {
    background: none;
    border: none;
    color: white;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    font-size: inherit;
    font-family: inherit;
  }

  .link-btn:hover {
    text-decoration: underline;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    color: white;
    gap: 1.5rem;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
