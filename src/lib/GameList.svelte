<script lang="ts">
  import GameCard from './GameCard.svelte'

  export let games = []
  export let onReorderGame = (reorderData: { fromIndex: number; toIndex: number }) => {}
  export let onDeleteGame = (deleteData: { id: string }) => {}

  let draggedIndex = null

  const handleDragStart = (index) => {
    draggedIndex = index
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (targetIndex) => {
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      onReorderGame({
        fromIndex: draggedIndex,
        toIndex: targetIndex
      })
      draggedIndex = null
    }
  }

  const moveUp = (index) => {
    if (index > 0) {
      onReorderGame({
        fromIndex: index,
        toIndex: index - 1
      })
    }
  }

  const moveDown = (index) => {
    if (index < games.length - 1) {
      onReorderGame({
        fromIndex: index,
        toIndex: index + 1
      })
    }
  }

  const deleteGame = (id) => {
    onDeleteGame({ id })
  }
</script>

<div class="list-container">
  <h2>Your Games {games.length > 0 ? `(${games.length})` : ''}</h2>

  <div class="games-list">
    {#each games as game, index (game.id)}
      <div
        class="game-item"
        draggable="true"
        on:dragstart={() => handleDragStart(index)}
        on:dragover={handleDragOver}
        on:drop={() => handleDrop(index)}
      >
        <div class="rank">{index + 1}</div>

        <div class="title-section">
          <h3>{game.title}</h3>
          {#if game.url}
            <a 
              href={game.url} 
              target="_blank" 
              rel="noreferrer" 
              class="link-icon" 
              title="Visit game website"
              aria-label="Visit {game.title} website"
            >
              <span aria-hidden="true">🔗</span>
            </a>
          {/if}
        </div>

        <div class="controls">
          <button
            class="btn-reorder"
            on:click={() => moveUp(index)}
            disabled={index === 0}
            title="Move up"
            aria-label="Move {game.title} up"
          >
            <span aria-hidden="true">⬆️</span>
          </button>
          <button
            class="btn-reorder"
            on:click={() => moveDown(index)}
            disabled={index === games.length - 1}
            title="Move down"
            aria-label="Move {game.title} down"
          >
            <span aria-hidden="true">⬇️</span>
          </button>
          <button
            class="btn-delete"
            on:click={() => deleteGame(game.id)}
            title="Delete game"
            aria-label="Delete {game.title}"
          >
            <span aria-hidden="true">🗑️</span>
          </button>
        </div>

        <div class="game-card-wrapper">
          <GameCard {game} />
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .list-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  h2 {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1.5rem;
  }

  .games-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    overflow-y: auto;
    flex: 1;
  }

  .game-item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto auto;
    gap: 1rem;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
    cursor: move;
    transition: background-color 0.2s, box-shadow 0.2s;
    border-left: 4px solid #667eea;
    align-items: start;
  }

  .game-item:hover {
    background: #efefef;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .rank {
    grid-column: 1;
    grid-row: 1;
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
    flex-shrink: 0;
  }

  .title-section {
    grid-column: 2;
    grid-row: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    text-align: left;
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

  .controls {
    grid-column: 3;
    grid-row: 1;
    display: flex;
    gap: 0.5rem;
  }

  .game-card-wrapper {
    grid-column: 1 / 4;
    grid-row: 2 / 4;
    min-width: 0;
  }

  .btn-reorder,
  .btn-delete {
    padding: 0.5rem;
    border: none;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s, transform 0.2s;
  }

  .btn-reorder:hover:not(:disabled) {
    background: #e0e0e0;
    transform: scale(1.1);
  }

  .btn-reorder:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-delete:hover {
    background: #ffebee;
    transform: scale(1.1);
  }

  .btn-reorder:active,
  .btn-delete:active {
    transform: scale(0.95);
  }
</style>
