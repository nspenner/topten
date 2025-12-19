<script>
  export let game = {}
</script>

<div class="game-card">
  <div class="card-content">
    <div class="title-section">
      <h3>{game.title}</h3>
      {#if game.url}
        <a href={game.url} target="_blank" rel="noreferrer" class="link-icon" title="Visit game website">
          🔗
        </a>
      {/if}
    </div>

    {#if game.screenshot}
      <img src={game.screenshot} alt={game.title} class="thumbnail" />
    {/if}

    <p class="description">{game.description}</p>
  </div>
</div>

<style>
  .game-card {
    flex: 1;
    min-width: 0;
  }

  .card-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .title-section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  h3 {
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

  .thumbnail {
    width: 100%;
    max-height: 150px;
    border-radius: 6px;
    object-fit: cover;
  }

  .description {
    margin: 0;
    color: #666;
    font-size: 0.95rem;
    line-height: 1.4;
  }
</style>
