<script lang="ts">
  import Button from './Button.svelte'

  export let onAddGame = (game: { title: string; description: string; url: string | null; screenshot: string | null }) => {}

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

<form on:submit={handleSubmit}>
  <h2>Add a Game</h2>

  <div class="form-group">
    <label for="title">Game Title *</label>
    <input
      type="text"
      id="title"
      bind:value={title}
      placeholder="e.g., The Legend of Zelda"
      required
    />
  </div>

  <div class="form-group">
    <label for="screenshotUrl">Screenshot URL (optional)</label>
    <input
      type="url"
      id="screenshotUrl"
      bind:value={screenshotUrl}
      on:change={handleImageUrlChange}
      placeholder="https://example.com/image.jpg"
    />
    {#if screenshotUrl && !imageError}
      <img
        src={screenshotUrl}
        alt="Preview"
        class="preview"
        on:load={handleImageLoad}
        on:error={handleImageError}
      />
    {/if}
    {#if imageError}
      <p class="error-text">Unable to load image. Check the URL.</p>
    {/if}
  </div>

  <div class="form-group">
    <label for="url">Game URL (optional)</label>
    <input
      type="url"
      id="url"
      bind:value={url}
      placeholder="https://example.com"
    />
  </div>

  <div class="form-group">
    <label for="description">Why is it in your list? (optional)</label>
    <textarea
      id="description"
      bind:value={description}
      placeholder="Share what makes this game special to you..."
      rows="4">
    </textarea>
  </div>

  <Button type="submit">Add Game</Button>
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
