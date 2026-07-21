<script lang="ts">
	import { bonusBeads, hasBonusBeadOffer, type Product } from '$lib/types/product';
	import { addToCart } from '$lib/stores/cart';
	import { currency } from '$lib/utils/currency';
	let { product }: { product: Product } = $props();
	let added = $state(false);
	function add() {
		addToCart(product, hasBonusBeadOffer(product.category) ? bonusBeads[0] : undefined);
		added = true;
		setTimeout(() => (added = false), 1800);
	}
</script>

<article class="product-card">
	<a href={`/produkt/${product.slug}`} class="product-image" aria-label={`Se ${product.name}`}
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
		<div class="product-bottom">
			<strong>{currency(product.price)}</strong><button
				class="round-button"
				aria-label={`Lägg ${product.name} i varukorgen`}
				onclick={add}>+</button
			>
		</div>
		{#if added}<span class="toast">Tillagd i varukorgen</span>{/if}
	</div>
</article>
