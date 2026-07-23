<script lang="ts">
	import type { GalleryProduct } from '$lib/data/creative-gallery';
	import { canExpressInterest, getGalleryStatusLabel } from '$lib/utils/gallery-product';

	let {
		product,
		onPreview
	}: { product: GalleryProduct; onPreview: (product: GalleryProduct) => void } = $props();
</script>

<article class="gallery-product-card">
	<button
		class="gallery-product-image"
		onclick={() => onPreview(product)}
		aria-label={`Visa större bild av ${product.title}`}
	>
		<img
			src={product.image}
			alt={product.alt}
			width={product.imageWidth}
			height={product.imageHeight}
		/>
	</button>
	<div class="gallery-product-copy">
		<div class="gallery-product-meta">
			<p class="eyebrow">{product.category}</p>
			<div class="gallery-product-badges">
				{#if product.isNew}<span class="gallery-new">Nyinkommen</span>{/if}
				<span class={`gallery-status gallery-status-${product.status}`}
					>{getGalleryStatusLabel(product.status)}</span
				>
			</div>
		</div>
		<h2>{product.title}</h2>
		<p>{product.description}</p>
		<div class="gallery-product-bottom">
			<strong>{product.price === null ? 'Pris kommer' : `${product.price} kr`}</strong>
			{#if canExpressInterest(product.status)}
				<a class="gallery-interest-button" href="#intresse">Jag är intresserad</a>
			{:else}
				<span class="gallery-interest-unavailable">{getGalleryStatusLabel(product.status)}</span>
			{/if}
		</div>
	</div>
</article>
