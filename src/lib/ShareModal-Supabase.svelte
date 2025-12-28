<script>
  import { saveGameList, getShareUrl, supabase } from './supabaseService'
  import { getShareUrl as getLegacyShareUrl } from './shareUtils'
  import Button from './Button.svelte'
  import Modal from './Modal.svelte'

  let { games = [], isOpen = $bindable(false) } = $props();

  const MAX_TITLE_LENGTH = 100

  let copied = $state(false)
  let shareUrl = $state('')
  let listTitle = $state('My Top 10 Games')
  let isLoading = $state(false)
  let useLegacyShare = $state(false) // Fallback if Supabase not configured

  const handleShare = async () => {
    isLoading = true
    
    try {
      // Try to save to Supabase if available
      if (supabase) {
        const slug = await saveGameList(games, {
          title: listTitle
        })
        
        if (slug) {
          shareUrl = getShareUrl(slug)
          useLegacyShare = false
        } else {
          // Fallback to legacy sharing
          console.warn('Failed to save to Supabase, using client-side encoding')
          shareUrl = getLegacyShareUrl(games, {
            title: listTitle
          })
          useLegacyShare = true
        }
      } else {
        // Supabase not configured, use client-side encoding
        console.warn('Supabase not configured, using client-side encoding')
        shareUrl = getLegacyShareUrl(games, {
          title: listTitle
        })
        useLegacyShare = true
      }
      
      copied = false
    } catch (error) {
      console.error('Error sharing:', error)
      alert('Failed to generate share link')
    } finally {
      isLoading = false
    }
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
    shareUrl = ''
  }
</script>

<Modal bind:showModal={isOpen}>
  <div class="modal-header">
    <h2 id="share-modal-title">Share Your List</h2>
    <button 
      class="close-btn" 
      onclick={closeModal}
      aria-label="Close"
    >✕</button>
  </div>

  <div class="modal-body">
    {#if !shareUrl}
      <p class="info">Customize and share your list:</p>

      <div class="metadata-fields">
        <div class="form-group">
          <label for="listTitle">List Title</label>
          <div class="input-wrapper">
            <input
              type="text"
              id="listTitle"
              bind:value={listTitle}
              placeholder="e.g., My Top 10 Games"
              maxlength={MAX_TITLE_LENGTH}
            />
            <span class="char-count" class:near-limit={listTitle.length > MAX_TITLE_LENGTH * 0.8}>
              {listTitle.length}/{MAX_TITLE_LENGTH}
            </span>
          </div>
        </div>
      </div>

      <Button onclick={handleShare} disabled={isLoading}>
        {#if isLoading}
          <span aria-hidden="true">⏳</span> Generating link...
        {:else}
          <span aria-hidden="true">🔗</span> Generate Share Link
        {/if}
      </Button>

      <div class="instructions">
        <p><strong>How it works:</strong></p>
        <ul>
          <li>Share the link with friends via text, email, or social media</li>
          <li>They can view your ranked list and see all the details</li>
          {#if supabase}
            <li>Your list is saved on our servers with a short link</li>
          {:else}
            <li>The link includes all your games, ratings, and descriptions</li>
          {/if}
        </ul>
        <p class="privacy-note">
          <strong>Privacy Note:</strong> By generating a link, your list will be stored publicly on our database.
        </p>
      </div>
    {:else}
      <p class="info">Share this link with friends:</p>

      <div class="url-container">
        <input
          type="text"
          readonly
          value={shareUrl}
          class="url-input"
          aria-label="Shareable URL"
        />
        <Button onclick={copyToClipboard}>
          {#if copied}
            <span aria-hidden="true">✓</span> Copied!
          {:else}
            <span aria-hidden="true">📋</span> Copy
          {/if}
        </Button>
      </div>

      {#if useLegacyShare}
        <p class="warning">
          <span aria-hidden="true">⚠️</span> Using client-side encoding (Supabase not configured). The URL is longer than needed.
          <a href="./SUPABASE_SETUP.md" target="_blank">Set up Supabase</a> for shorter URLs.
        </p>
      {:else}
        <p class="success"><span aria-hidden="true">✓</span> List saved! Short link ready to share.</p>
      {/if}

      <Button onclick={closeModal} style="margin-top: 1rem; width: 100%; background: #f0f0f0; color: #333;">Close</Button>
    {/if}
  </div>
</Modal>

<style>
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

  .info {
    margin: 0 0 1rem 0;
    color: #666;
    font-size: 0.95rem;
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

  .input-wrapper {
    position: relative;
    width: 100%;
  }

  .char-count {
    position: absolute;
    right: 0.75rem;
    bottom: -1.2rem;
    font-size: 0.75rem;
    color: #888;
  }

  .char-count.near-limit {
    color: #d32f2f;
  }

  .form-group input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.95rem;
    font-family: inherit;
    transition: border-color 0.2s;
  }

  .form-group input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .url-container {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .url-input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.85rem;
    font-family: monospace;
    background: #f9f9f9;
  }

  .instructions {
    text-align: left;
    margin-top: 1.5rem;
    padding: 1rem;
    background: #f0f7ff;
    border-radius: 6px;
    border-left: 4px solid #667eea;
  }

  .instructions p {
    margin: 0 0 0.75rem 0;
    font-weight: 600;
    color: #333;
    font-size: 0.95rem;
  }

  .instructions ul {
    margin: 0;
    padding-left: 1.25rem;
    color: #666;
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .instructions li {
    margin-bottom: 0.5rem;
  }

  .privacy-note {
    margin-top: 1rem !important;
    font-size: 0.8rem !important;
    color: #666 !important;
    font-weight: normal !important;
    border-top: 1px solid rgba(0,0,0,0.05);
    padding-top: 0.75rem;
  }

  .warning {
    margin: 1rem 0;
    padding: 0.75rem;
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 4px;
    color: #856404;
    font-size: 0.85rem;
    line-height: 1.5;
  }

  .warning a {
    color: #856404;
    font-weight: 600;
    text-decoration: underline;
  }

  .success {
    margin: 1rem 0;
    padding: 0.75rem;
    background: #d4edda;
    border: 1px solid #28a745;
    border-radius: 4px;
    color: #155724;
    font-size: 0.85rem;
  }
</style>
