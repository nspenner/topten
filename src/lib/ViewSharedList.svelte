<script>
  import GameCard from './GameCard.svelte'

  export let games = []
  export let metadata = {}
</script>

<div class="shared-container">
  <div class="shared-badge">👥 Shared List</div>
  <h2>{metadata.title || 'Top 10 Video Games'}</h2>
  {#if metadata.author}
    <p class="author">by {metadata.author}</p>
  {/if}

  {#if games.length === 0}
    <p class="empty-state">This list is empty.</p>
  {:else}
    <div class="games-list">
      {#each games as game, index (index)}
        <div class="game-item">
          <div class="rank">{index + 1}</div>

          <div class="title-section">
            <h3>{game.title}</h3>
            {#if game.url}
              <a href={game.url} target="_blank" rel="noreferrer" class="link-icon" title="Visit game website">
                🔗
              </a>
            {/if}
          </div>

          <div class="game-card-wrapper">
            <GameCard {game} />
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <p class="footer-note">
    ⚡ Create your own top 10 list by visiting <a href="/">topten</a>
  </p>
</div>

<style>
  .shared-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }

  .shared-badge {
    display: inline-block;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  h2 {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 1.8rem;
  }

  .author {
    margin: 0 0 1.5rem 0;
    color: #999;
    font-size: 0.95rem;
    font-style: italic;
  }

  .empty-state {
    text-align: center;
    color: #999;
    padding: 2rem;
    font-style: italic;
  }

  .games-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .game-item {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    gap: 1rem;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
    border-left: 4px solid #667eea;
    align-items: start;
  }

  .title-section {
    grid-column: 2;
    grid-row: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
  }

  .title-section h3 {
    margin: 0;
    color: #333;
    font-size: 1.1rem;
    flex: 1;
    min-width: 0;
  }

  .link-icon {
    flex-shrink: 0;
    font-size: 1.2rem;
    text-decoration: none;
    transition: transform 0.2s;
  }

  .link-icon:hover {
    transform: scale(1.2);
  }

  .game-card-wrapper {
    grid-column: 1 / 3;
    grid-row: 2;
    min-width: 0;
  }

  .rank {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
  }

  .footer-note {
    text-align: center;
    color: #999;
    font-size: 0.9rem;
    margin-top: 2rem;
    border-top: 1px solid #e0e0e0;
    padding-top: 1rem;
  }

  .footer-note a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
  }

  .footer-note a:hover {
    text-decoration: underline;
  }
</style>
