<script>
  import { getShareUrl } from './shareUtils'
  import Button from './Button.svelte';

  export let games = []
  export let isOpen = false

  let copied = false
  let shareUrl = ''
  let listTitle = 'My Top 10 Games'
  let listAuthor = ''

  $: if (isOpen) {
    shareUrl = getShareUrl(games, {
      title: listTitle,
      author: listAuthor
    })
    copied = false
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      copied = true
      setTimeout(() => {
        copied = false
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      alert('Failed to copy to clipboard')
    }
  }

  const closeModal = () => {
    isOpen = false
  }
</script>

{#if isOpen}
  <div class="modal-overlay" on:click={closeModal}>
    <div class="modal-content" on:click={(e) => e.stopPropagation()}>
      <div class="modal-header">
        <h2>Share Your List</h2>
        <button class="close-btn" on:click={closeModal}>✕</button>
      </div>

      <div class="modal-body">
        <p class="info">Customize and share your list:</p>

        <div class="metadata-fields">
          <div class="form-group">
            <label for="listTitle">List Title</label>
            <input
              type="text"
              id="listTitle"
              bind:value={listTitle}
              placeholder="e.g., My Top 10 Games"
            />
          </div>

          <div class="form-group">
            <label for="listAuthor">Author (optional)</label>
            <input
              type="text"
              id="listAuthor"
              bind:value={listAuthor}
              placeholder="Your name"
            />
          </div>
        </div>

        <p class="info">Share this link with friends:</p>

        <div class="url-container">
          <input
            type="text"
            readonly
            value={shareUrl}
            class="url-input"
          />
          <Button onClick={copyToClipboard}>{copied ? '✓ Copied!' : '📋 Copy'}</Button>
        </div>

        <div class="instructions">
          <p><strong>How it works:</strong></p>
          <ul>
            <li>Share the link with friends via text, email, or social media</li>
            <li>They can view your ranked list and see all the details</li>
            <li>Your local data is never uploaded anywhere</li>
            <li>The link includes all your games, ratings, and descriptions</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 90%;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .modal-header h2 {
    margin: 0;
    color: #333;
    font-size: 1.5rem;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #999;
    transition: color 0.2s;
  }

  .close-btn:hover {
    color: #333;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .metadata-fields {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 6px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-weight: 600;
    color: #333;
    font-size: 0.9rem;
  }

  .form-group input {
    padding: 0.6rem;
    border: 2px solid #e0e0e0;
    border-radius: 4px;
    font-size: 0.95rem;
    transition: border-color 0.2s;
  }

  .form-group input:focus {
    outline: none;
    border-color: #667eea;
  }

  .info {
    color: #666;
    margin-bottom: 1rem;
  }

  .url-container {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .url-input {
    flex: 1;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-family: monospace;
    font-size: 0.85rem;
    word-break: break-all;
    cursor: pointer;
  }

  .instructions {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #666;
  }

  .instructions p {
    margin: 0 0 0.5rem 0;
  }

  .instructions strong {
    color: #333;
  }

  .instructions ul {
    margin: 0.5rem 0 0 1.5rem;
    padding: 0;
  }

  .instructions li {
    margin-bottom: 0.4rem;
  }
</style>
