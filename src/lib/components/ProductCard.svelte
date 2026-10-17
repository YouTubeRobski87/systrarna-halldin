<script lang="ts">
	import { bonusBeads, hasBonusBeadOffer, type Product } from '$lib/types/product';
	import { addToCart } from '$lib/stores/cart';
	import { currency } from '$lib/utils/currency';
	import { getGalleryStatusLabel } from '$lib/utils/gallery-product';
	let { product }: { product: Product } = $props();
	let added = $state(false);
	const available = $derived(!product.status || product.status === 'available');
	const statusLabel = $derived(
		product.status ? getGalleryStatusLabel(product.status) : 'Tillgänglig'
	);
	function add() {
		if (!available) return;
		addToCart(product, hasBonusBeadOffer(product.category) ? bonusBeads[0] : undefined);
		added = true;
		setTimeout(() => (added = false), 1800);
	}
</script>

<article class="product-card">
	{#if product.isNew}<span class="product-badge">Nytt</span>{/if}
	<a
		href={`/produkt/${product.slug}`}
		class="product-image"
		class:stress-ball-image={product.category === 'Stressbollar'}
		aria-label={`Se ${product.name}`}
		><img
			src={product.image}
			alt={product.imageAlt}
			width={product.imageWidth}
			height={product.imageHeight}
		/></a
	>
	<div class="product-copy">
		<p class="eyebrow">{product.category}</p>
		<h3><a href={`/produkt/${product.slug}`}>{product.name}</a></h3>
		<p>{product.shortDescription}</p>
		<div class="product-meta">
			<span>Skapat av {product.madeBy ?? 'Alma & Emilia'}</span><span class:unavailable={!available}
				>{statusLabel}</span
			>
		</div>
		<div class="product-bottom">
			<strong>{currency(product.price)}</strong><button
				class="round-button"
				disabled={!available}
				aria-label={available
					? `Lägg ${product.name} i varukorgen`
					: `${product.name}: ${statusLabel.toLocaleLowerCase('sv-SE')}`}
				onclick={add}>{available ? '+' : '×'}</button
			>
		</div>
		{#if hasBonusBeadOffer(product.category)}
			<p class="product-offer">🎁 Extra pärla medföljer</p>
		{/if}
		{#if added}<span class="toast">Tillagd i varukorgen</span>{/if}
	</div>
</article>
