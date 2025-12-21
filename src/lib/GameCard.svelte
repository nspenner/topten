<script>
  export let game = {};
</script>

<div class="game-card">
  <div class="card-content">
    {#if game.screenshot}
      <img src={game.screenshot} alt={game.title} class="thumbnail" />
    {/if}

    <p class="description">{game.description}</p>
    {#if game.url}
      <a
        href={game.url}
        target="_blank"
        rel="noreferrer"
        class="link-text"
        title="Visit game website"
      >
        Visit game website
      </a>
    {/if}
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
    border-radius: 6px;
    object-fit: cover;
  }

  .description {
    margin: 0;
    color: hsl(245, 30%, 35%);
    font-size: 0.95rem;
    line-height: 1.4;
    text-align: left;
    font-weight: 600;
  }

  .link-text {
    font-size: 0.8rem;
    text-align: left;
  }
</style>
