<script>
  export let game = {}
</script>

<div class="game-card">
  <div class="card-content">
    {#if game.screenshot}
      <img src={game.screenshot} alt={game.title} class="thumbnail" />
    {/if}

    <p class="description">{game.description}</p>
  </div>
</div>

<style>
  .game-card {
    width: 100%;
    min-width: 0;
  }

  .card-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
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
    text-align: left;
  }
</style>
