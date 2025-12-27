<script>
  import { saveGameList, getShareUrl, supabase } from './supabaseService'
  import { getShareUrl as getLegacyShareUrl } from './shareUtils'
  import Button from './Button.svelte'

  export let games = []
  export let isOpen = false

  let copied = false
  let shareUrl = ''
  let listTitle = 'My Top 10 Games'
  let isLoading = false
  let useLegacyShare = false // Fallback if Supabase not configured

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
      aria-labelledby="share-modal-title"
      tabindex="-1"
    >
      <div class="modal-header">
        <h2 id="share-modal-title">Share Your List</h2>
        <button 
          class="close-btn" 
          on:click={closeModal}
          aria-label="Close"
        >✕</button>
      </div>

      <div class="modal-body">
        {#if !shareUrl}
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
          </div>

          <Button onClick={handleShare} disabled={isLoading}>
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
            <Button onClick={copyToClipboard}>
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

          <Button onClick={closeModal} style="margin-top: 1rem; width: 100%; background: #f0f0f0; color: #333;">Close</Button>
        {/if}
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
    margin: 1rem 0 0 0;
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
    margin: 1rem 0 0 0;
    padding: 0.75rem;
    background: #d4edda;
    border: 1px solid #28a745;
    border-radius: 4px;
    color: #155724;
    font-size: 0.85rem;
  }
</style>
