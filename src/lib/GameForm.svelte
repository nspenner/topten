<script lang="ts">
  import Button from './Button.svelte'

  export let onAddGame = (game: { title: string; description: string; url: string | null; screenshot: string | null }) => {}
  export let gameCount = 0

  const MAX_GAMES = 15
  const MAX_TITLE_LENGTH = 50
  const MAX_DESCRIPTION_LENGTH = 250
  const MAX_URL_LENGTH = 250

  let title = ''
  let description = ''
  let url = ''
  let screenshotUrl = ''
  let imageError = false

  const handleImageUrlChange = () => {
    imageError = false
  }

  const handleImageLoad = () => {
    imageError = false
  }

  const handleImageError = () => {
    imageError = true
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Please enter a game title')
      return
    }

    onAddGame({
      title: title.trim(),
      description: description.trim(),
      url: url.trim() || null,
      screenshot: screenshotUrl.trim() || null
    })

    // Reset form
    title = ''
    description = ''
    url = ''
    screenshotUrl = ''
    imageError = false
  }
</script>

<form onsubmit={handleSubmit}>
  <h2>Add a Game</h2>

  <div class="form-group">
    <label for="title">Game Title <span class="required" aria-hidden="true">*</span></label>
    <div class="input-wrapper">
      <input
        type="text"
        id="title"
        bind:value={title}
        placeholder="e.g., The Legend of Zelda"
        required
        aria-required="true"
        maxlength={MAX_TITLE_LENGTH}
      />
      <span class="char-count" class:near-limit={title.length > MAX_TITLE_LENGTH * 0.8}>
        {title.length}/{MAX_TITLE_LENGTH}
      </span>
    </div>
  </div>

  <div class="form-group">
    <label for="screenshotUrl">Screenshot URL (optional)</label>
    <div class="input-wrapper">
      <input
        type="url"
        id="screenshotUrl"
        bind:value={screenshotUrl}
        onchange={handleImageUrlChange}
        placeholder="https://example.com/image.jpg"
        maxlength={MAX_URL_LENGTH}
      />
      <span class="char-count" class:near-limit={screenshotUrl.length > MAX_URL_LENGTH * 0.8}>
        {screenshotUrl.length}/{MAX_URL_LENGTH}
      </span>
    </div>
    {#if screenshotUrl && !imageError}
      <div class="preview-container">
        <img
          src={screenshotUrl}
          alt="Preview of {title || 'game'}"
          class="preview"
          onload={handleImageLoad}
          onerror={handleImageError}
        />
      </div>
    {/if}
    {#if imageError}
      <p class="error-text" role="alert">Unable to load image. Check the URL.</p>
    {/if}
  </div>

  <div class="form-group">
    <label for="url">Game URL (optional)</label>
    <div class="input-wrapper">
      <input
        type="url"
        id="url"
        bind:value={url}
        placeholder="https://example.com"
        maxlength={MAX_URL_LENGTH}
      />
      <span class="char-count" class:near-limit={url.length > MAX_URL_LENGTH * 0.8}>
        {url.length}/{MAX_URL_LENGTH}
      </span>
    </div>
  </div>

  <div class="form-group">
    <label for="description">Why is it in your list? (optional)</label>
    <div class="input-wrapper">
      <textarea
        id="description"
        bind:value={description}
        placeholder="Share what makes this game special to you..."
        rows="4"
        maxlength={MAX_DESCRIPTION_LENGTH}>
      </textarea>
      <span class="char-count" class:near-limit={description.length > MAX_DESCRIPTION_LENGTH * 0.8}>
        {description.length}/{MAX_DESCRIPTION_LENGTH}
      </span>
    </div>
  </div>

  <Button type="submit" disabled={gameCount >= MAX_GAMES}>
    {gameCount >= MAX_GAMES ? `Limit Reached (${MAX_GAMES})` : 'Add Game'}
  </Button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  h2 {
    margin: 0 0 1rem 0;
    color: hsl(245, 30%, 35%);
    font-size: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  label {
    font-weight: 600;
    color: hsl(245, 30%, 35%);
    font-size: 0.95rem;
  }

  .input-wrapper {
    width: 100%;
    position: relative;
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

  input[type='text'],
  input[type='url'],
  textarea {
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-family: inherit;
    font-size: 1rem;
    transition: border-color 0.3s;
    width: 100%;
  }

  input[type='text']:focus,
  input[type='url']:focus,
  textarea:focus {
    outline: none;
    border-color: #667eea;
  }

  textarea {
    resize: vertical;
    font-family: inherit;
  }

  .preview {
    max-width: 100%;
    max-height: 200px;
    border-radius: 6px;
    margin-top: 0.5rem;
    object-fit: cover;
  }

  .error-text {
    color: #d32f2f;
    font-size: 0.9rem;
    margin: 0.5rem 0 0 0;
  }
</style>
