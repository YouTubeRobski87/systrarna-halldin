<script lang="ts">
	import type { Product } from '$lib/types/product';
	import ProductCard from './ProductCard.svelte';
	let { items, title }: { items: Product[]; title?: string } = $props();
</script>

{#if title}<div class="section-heading">
		<p class="eyebrow">Våra favoriter</p>
		<h2>{title}</h2>
	</div>{/if}
<div class="product-grid">
	{#each items as product (product.id)}<ProductCard {product} />{/each}
</div>
