<script lang="ts">
	import { tick } from 'svelte';
	import GalleryLightbox from '$lib/components/GalleryLightbox.svelte';
	import GalleryProductCard from '$lib/components/GalleryProductCard.svelte';
	import {
		creativeCategories,
		creativeGalleryProducts,
		type CreativeCategory,
		type GalleryProduct
	} from '$lib/data/creative-gallery';
	import { sortFeaturedFirst } from '$lib/utils/gallery-product';

	type GalleryFilter = 'Alla' | CreativeCategory;

	let activeFilter = $state<GalleryFilter>('Alla');
	let selectedProduct = $state<GalleryProduct | null>(null);
	let previewTrigger = $state<HTMLButtonElement | null>(null);

	function openPreview(product: GalleryProduct, trigger: HTMLButtonElement) {
		previewTrigger = trigger;
		selectedProduct = product;
	}

	async function closePreview() {
		selectedProduct = null;
		await tick();
		previewTrigger?.focus();
	}
	const sortedProducts = $derived(sortFeaturedFirst(creativeGalleryProducts));
	const filteredProducts = $derived(
		activeFilter === 'Alla'
			? sortedProducts
			: sortedProducts.filter((product) => product.category === activeFilter)
	);
	const filters: GalleryFilter[] = ['Alla', ...creativeCategories];
</script>

<svelte:head>
	<title>Galleri – Systrarna Halldin</title>
	<meta
		name="description"
		content="Se pärlplattor, suddgummi och pappers-squishies som Alma och Emilia har skapat."
	/>
</svelte:head>

<main class="page creative-gallery-page">
	<section class="creative-gallery-hero">
		<p class="eyebrow">Skapat av Alma & Emilia</p>
		<h1>Vårt lilla galleri</h1>
		<p>
			Här samlar vi handgjorda pärlplattor, suddgummi och pappers-squishies. Varje sak har sin egen
			personlighet.
		</p>
	</section>

	<nav class="creative-gallery-filters" aria-label="Filtrera galleriet">
		{#each filters as filter}
			<button
				class:active={activeFilter === filter}
				aria-pressed={activeFilter === filter}
				onclick={() => (activeFilter = filter)}>{filter}</button
			>
		{/each}
	</nav>

	<section class="creative-gallery-grid" aria-live="polite">
		{#each filteredProducts as product (product.id)}
			<GalleryProductCard {product} onPreview={openPreview} />
		{/each}
	</section>

	<section class="gallery-closing">
		<h2>Fler skapelser kommer snart</h2>
		<p>Alma och Emilia fyller på galleriet när nya idéer blir verklighet.</p>
	</section>
</main>

{#if selectedProduct}
	<GalleryLightbox product={selectedProduct} close={closePreview} />
{/if}
