<script>
  import Button from './Button.svelte'

  export let isOpen = false

  const closeModal = () => {
    isOpen = false
  }

  const handleKeydown = (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeModal()
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <div 
    class="modal-overlay" 
    on:click={closeModal} 
    on:keydown={(e) => e.key === 'Enter' && closeModal()}
    role="button"
    tabindex="-1"
    aria-label="Close modal"
  >
    <div 
      class="modal-content" 
      on:click={(e) => e.stopPropagation()}
      on:keydown={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div class="modal-header">
        <h2 id="privacy-modal-title">Privacy Policy</h2>
        <button 
          class="close-btn" 
          on:click={closeModal}
          aria-label="Close"
        >✕</button>
      </div>

      <div class="modal-body">
        <p>This site is a hobby project.</p>

        <h3>Data Collection</h3>
        <p>When you click "Generate Share Link", we save the following to our database:</p>
        <ul>
          <li>The title of your list</li>
          <li>The list of games, descriptions, and ratings</li>
        </ul>

        <h3>Data Usage</h3>
        <p>This data is used solely to generate a unique URL so you can share your list with others.</p>
      </div>

      <div class="modal-footer">
        <Button onClick={closeModal}>Close</Button>
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
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
  }

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    position: relative;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 1rem;
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
    color: #444;
    line-height: 1.6;
    text-align: left;
  }

  .modal-body h3 {
    margin: 1.5rem 0 0.5rem 0;
    color: #333;
    font-size: 1.1rem;
  }

  .modal-body p {
    margin: 0 0 1rem 0;
  }

  .modal-body ul {
    margin: 0 0 1rem 0;
    padding-left: 1.5rem;
  }

  .modal-body li {
    margin-bottom: 0.25rem;
  }

  .modal-body a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
  }

  .modal-body a:hover {
    text-decoration: underline;
  }

  .modal-footer {
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;
  }
</style>
