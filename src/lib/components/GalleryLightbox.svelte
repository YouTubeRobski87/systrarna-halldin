<script lang="ts">
	import type { GalleryProduct } from '$lib/data/creative-gallery';

	let { product, close }: { product: GalleryProduct; close: () => void } = $props();

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') close();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="gallery-lightbox-backdrop"
	role="presentation"
	onclick={(event) => event.currentTarget === event.target && close()}
>
	<dialog class="gallery-lightbox" open aria-labelledby="lightbox-title">
		<button class="gallery-lightbox-close" onclick={close} aria-label="Stäng stor bild">×</button>
		<div class="gallery-lightbox-media">
			<img
				src={product.image}
				alt={product.alt}
				width={product.imageWidth}
				height={product.imageHeight}
			/>
		</div>
		<div class="gallery-lightbox-copy">
			<p class="eyebrow">{product.category}</p>
			<h2 id="lightbox-title">{product.title}</h2>
			<p class="gallery-lightbox-creator">
				<span aria-hidden="true">✦</span> Skapad av {product.creator ?? 'Alma & Emilia'}
			</p>
		</div>
	</dialog>
</div>
