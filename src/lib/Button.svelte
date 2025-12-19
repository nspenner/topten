<script lang="ts">
  export let type: 'button' | 'submit' | 'reset'
  export let disabled = false
  export let variant = 'primary'
  export let onClick = null
</script>

<button
  {type}
  {disabled}
  class={`btn btn-${variant}`}
  on:click={onClick}
>
  <slot />
</button>

<style>
  .btn {
    padding: 0.75rem 1.5rem;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    font-family: inherit;
  }

  .btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
  }

  .btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: linear-gradient(135deg, #3c69bf 0%, #3c69bf 100%);
  }

  .btn-secondary {
    background: #f5f5f5;
    color: #333;
    border: 2px solid #e0e0e0;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #efefef;
  }

  .btn-danger {
    background: #d32f2f;
  }

  .btn-danger:hover:not(:disabled) {
    box-shadow: 0 5px 20px rgba(211, 47, 47, 0.4);
  }
</style>
