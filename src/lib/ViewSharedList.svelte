<script>
  import GameCard from "./GameCard.svelte";
  import Button from "./Button.svelte";
  import { generateListImage } from "./imageGenerator.js";

  export let games = [];
  export let metadata = {};

  let isGenerating = false;

  async function handleDownload() {
    isGenerating = true;
    try {
      await generateListImage(games, metadata);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      isGenerating = false;
    }
  }
</script>

<div class="shared-container">
  <div class="header-info">
    <h2>{metadata.title || "Top 10 Video Games"}</h2>
    <Button onclick={handleDownload} disabled={isGenerating || games.length === 0}>
      {isGenerating ? "Generating..." : "Download List Image"}
    </Button>
    <span class="download-hint">Only the top 10 games will be included in the image.</span>
  </div>

  {#if games.length === 0}
    <p class="empty-state">This list is empty.</p>
  {:else}
    <div class="games-list">
      {#each games as game, index (index)}
        <div class="game-item">
          <div class="rank">{index + 1}</div>

          <div class="title-section">
            <h3>{game.title}</h3>
          </div>

          <div class="game-card-wrapper">
            <GameCard {game} />
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <p class="footer-note">
    <span aria-hidden="true">⚡</span> Create your own top 10 list by visiting <a href="/">topten</a>
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

  .header-info {
    margin-bottom: 2rem;
  }

  h2 {
    margin: 0 0 0.5rem 0;
    color: hsl(245, 30%, 35%);
    font-size: 1.8rem;
  }

  .download-hint {
    display: block;
    margin-top: 0.5rem;
    font-size: 0.8rem;
    color: #888;
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
    gap: 3rem;
    margin-bottom: 2rem;
  }

  .game-item {
    display: grid;
    min-height: 160px;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    gap: 1rem;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
    border-right: 4px solid #667eea;
    align-items: start;
    position: relative;
  }

  .title-section {
    grid-column: 2;
    grid-row: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    min-height: 80px;
    padding: 0 2rem;
  }

  .title-section h3 {
    margin: 0;
    color: hsl(245, 30%, 35%);
    font-size: 1.4rem;
    flex: 1;
    min-width: 0;
  }

  .game-card-wrapper {
    grid-column: 1 / 3;
    grid-row: 2;
    min-width: 0;
  }

  .rank {
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    position: absolute;
    left: -45px;
    top: -8px;
    font-size: 3.5rem;
    font-size: 3.5rem;
    background: linear-gradient(
      135deg,
      hsl(270, 37%, 66%) 0%,
      hsl(270, 37%, 46%) 100%
    );
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 3rem;
    border: 8px solid #ffa500;
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

  @media (max-width: 1024px) {
    .shared-container {
      padding: 1.5rem 1rem;
    }

    h2 {
      font-size: 1.5rem;
    }

    .game-item {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto;
      gap: 1rem;
    }

    .title-section {
      grid-column: 1;
      grid-row: 1;
      min-height: 0;
    }

    .title-section h3 {
      font-size: 1.2rem;
    }

    .game-card-wrapper {
      grid-column: 1;
      grid-row: 2;
    }

    .rank {
      position: absolute;
      left: -32px;
      top: -18px;
      width: 64px;
      height: 64px;
      font-size: 2rem;
      border: 4px solid #ffa500;
    }
  }
</style>
