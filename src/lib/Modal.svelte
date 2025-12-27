<script>
	let { showModal = $bindable(), children } = $props();

	let dialog;

	$effect(() => {
		if (showModal) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(e) => { if (e.target === dialog) dialog.close(); }}
>
	<div onclick={(e) => e.stopPropagation()} role="presentation">
		{@render children()}
	</div>
</dialog>

<style>
	dialog {
		max-width: 500px;
		width: 90%;
		border-radius: 12px;
		border: none;
		padding: 0;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		background: white;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(4px);
	}

	dialog > div {
		padding: 2rem;
	}

	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes zoom {
		from {
			transform: scale(0.95);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
