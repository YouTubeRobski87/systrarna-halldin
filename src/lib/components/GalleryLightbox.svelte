<script lang="ts">
	import { onMount } from 'svelte';
	import type { GalleryProduct } from '$lib/data/creative-gallery';
	import { getGalleryStatusLabel } from '$lib/utils/gallery-product';

	let { product, close }: { product: GalleryProduct; close: () => void } = $props();

	let dialogElement = $state<HTMLDialogElement>();
	let closeButton = $state<HTMLButtonElement>();

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			close();
			return;
		}

		if (event.key !== 'Tab' || !dialogElement) return;

		const focusable = Array.from(
			dialogElement.querySelectorAll<HTMLElement>(
				'button:not([disabled]), a[href], input, select, textarea'
			)
		);
		if (!focusable.length) return;

		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	}

	onMount(() => {
		closeButton?.focus();
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="gallery-lightbox-backdrop"
	role="presentation"
	onclick={(event) => event.currentTarget === event.target && close()}
>
	<dialog
		bind:this={dialogElement}
		class="gallery-lightbox"
		open
		aria-modal="true"
		aria-labelledby="lightbox-title"
		aria-describedby="lightbox-description"
	>
		<button
			bind:this={closeButton}
			class="gallery-lightbox-close"
			onclick={close}
			aria-label="Stäng stor bild">×</button
		>
		<div class="gallery-lightbox-media">
			<span class="gallery-lightbox-accent" aria-hidden="true"></span>
			<img
				src={product.image}
				alt={product.alt}
				width={product.imageWidth}
				height={product.imageHeight}
			/>
			{#if product.creator}
				<div class="creator-badge">
					<span aria-hidden="true">♡</span> Handgjord av {product.creator}
				</div>
			{/if}
		</div>
		<div class="gallery-lightbox-copy">
			<p class="eyebrow">{product.category}</p>
			<h2 id="lightbox-title">{product.title}</h2>
			<p class="lightbox-price">{product.price === null ? 'Pris kommer' : `${product.price} kr`}</p>
			<p class="lightbox-status">{getGalleryStatusLabel(product.status)}</p>
			{#if product.creator}<p class="gallery-lightbox-creator">Skapad av {product.creator}</p>{/if}
			<p id="lightbox-description" class="gallery-lightbox-description">{product.description}</p>
		</div>
	</dialog>
</div>
