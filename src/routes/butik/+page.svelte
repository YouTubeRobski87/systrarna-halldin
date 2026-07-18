<script lang="ts">
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import { categories, products } from '$lib/data/products';
	import type { Category } from '$lib/types/product';
	let selected = $state<string>('Alla');
	let sort = $state('featured');
	let filtered = $derived(
		products
			.filter((p) => selected === 'Alla' || p.category === (selected as Category))
			.toSorted((a, b) =>
				sort === 'price-low'
					? a.price - b.price
					: sort === 'price-high'
						? b.price - a.price
						: sort === 'name'
							? a.name.localeCompare(b.name)
							: Number(b.featured) - Number(a.featured)
			)
	);
</script>

<svelte:head
	><title>Butik – Systrarna Halldin</title><meta
		name="description"
		content="Shoppa handgjorda armband, nyckelringar och squishies."
	/><link rel="canonical" href="https://systrarnahalldin.se/butik" /></svelte:head
>
<main class="page">
	<p class="eyebrow">Vår lilla butik</p>
	<h1>Hitta din favorit</h1>
	<p class="intro">Små upplagor, handgjorda detaljer och massor av färg.</p>
	<div class="shop-controls">
		<div class="filters" aria-label="Filtrera kategori">
			{#each categories as category}<button
					class:active={selected === category}
					onclick={() => (selected = category)}>{category}</button
				>{/each}
		</div>
		<label class="sort"
			>Sortera <select bind:value={sort}
				><option value="featured">Utvalda först</option><option value="price-low"
					>Lägsta pris</option
				><option value="price-high">Högsta pris</option><option value="name">Namn A–Ö</option
				></select
			></label
		>
	</div>
	<p class="result-count">{filtered.length} produkter</p>
	<ProductGrid items={filtered} />
</main>
