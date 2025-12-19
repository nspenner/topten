<script>
  import GameCard from './GameCard.svelte'

  export let games = []
  export let onReorderGame = () => {}
  export let onDeleteGame = () => {}

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

        <GameCard {game} />

        <div class="controls">
          <button
            class="btn-reorder"
            on:click={() => moveUp(index)}
            disabled={index === 0}
            title="Move up"
          >
            ⬆️
          </button>
          <button
            class="btn-reorder"
            on:click={() => moveDown(index)}
            disabled={index === games.length - 1}
            title="Move down"
          >
            ⬇️
          </button>
          <button
            class="btn-delete"
            on:click={() => deleteGame(game.id)}
            title="Delete game"
          >
            🗑️
          </button>
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
    gap: 1rem;
    overflow-y: auto;
    flex: 1;
  }

  .game-item {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
    cursor: move;
    transition: background-color 0.2s, box-shadow 0.2s;
    border-left: 4px solid #667eea;
  }

  .game-item:hover {
    background: #efefef;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

  .controls {
    flex-shrink: 0;
    display: flex;
    gap: 0.5rem;
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
