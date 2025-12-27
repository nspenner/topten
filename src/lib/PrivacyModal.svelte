<script>
  import Button from './Button.svelte'
  import Modal from './Modal.svelte'

  let { isOpen = $bindable(false) } = $props();

  const closeModal = () => {
    isOpen = false
  }
</script>

<Modal bind:showModal={isOpen}>
  <div class="modal-header">
    <h2 id="privacy-modal-title">Privacy Policy</h2>
    <button 
      class="close-btn" 
      onclick={closeModal}
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
    <Button onclick={closeModal}>Close</Button>
  </div>
</Modal>

<style>
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

  .modal-footer {
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;
  }
</style>
