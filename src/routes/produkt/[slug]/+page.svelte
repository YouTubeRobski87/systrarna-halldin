<script lang="ts">
	import type { PageData } from './$types';
	import { products } from '$lib/data/products';
	import { addToCart } from '$lib/stores/cart';
	import { currency } from '$lib/utils/currency';
	import QuantitySelector from '$lib/components/QuantitySelector.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	let { data }: { data: PageData } = $props();
	let quantity = $state(1);
	let variation = $state('');
	let added = $state(false);
	$effect(() => {
		if (!variation) variation = data.product.colors?.[0] ?? '';
	});
	let structuredData = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Product',
			name: data.product.name,
			description: data.product.description,
			offers: {
				'@type': 'Offer',
				price: data.product.price,
				priceCurrency: 'SEK',
				...(data.product.stock !== undefined
					? {
							availability: data.product.stock
								? 'https://schema.org/InStock'
								: 'https://schema.org/OutOfStock'
						}
					: {})
			}
		})
	);
	const related = $derived(
		products
			.filter((p) => p.category === data.product.category && p.id !== data.product.id)
			.slice(0, 3)
	);
	function add() {
		addToCart(data.product, variation || undefined, quantity);
		added = true;
		setTimeout(() => (added = false), 1800);
	}
</script>

<svelte:head
	><title>{data.product.name} – Systrarna Halldin</title><meta
		name="description"
		content={data.product.shortDescription}
	/><link
		rel="canonical"
		href={`https://systrarnahalldin.se/produkt/${data.product.slug}`}
	/>{@html '<script type="application/ld+json">' + structuredData + '<' + '/script>'}</svelte:head
>
<main class="page">
	<a class="back-link" href="/butik">← Tillbaka till butiken</a>
	<section class="product-detail">
		<div class="detail-image">
			{#if data.product.image.startsWith('/')}
				<img
					src={data.product.image}
					alt={data.product.imageAlt}
					width={data.product.imageWidth}
					height={data.product.imageHeight}
				/>
			{:else}
				<span>{data.product.image}</span>
			{/if}
		</div>
		<div class="detail-copy">
			<p class="eyebrow">{data.product.category}</p>
			<h1>{data.product.name}</h1>
			<strong class="price">{currency(data.product.price)}</strong>
			{#if data.product.stock !== undefined}<p
					class:low-stock={data.product.stock < 4}
					class="stock"
				>
					{data.product.stock < 4
						? `Bara ${data.product.stock} kvar i lager`
						: 'I lager – redo att skickas'}
				</p>{/if}
			<p class="description">{data.product.description}</p>
			{#if data.product.colors}<fieldset class="variations">
					<legend>Välj färg</legend>
					<div>
						{#each data.product.colors as color}<button
								class:chosen={variation === color}
								onclick={() => (variation = color)}>{color}</button
							>{/each}
					</div>
				</fieldset>{/if}
			<div class="purchase">
				<QuantitySelector
					value={quantity}
					max={data.product.stock ?? 99}
					onChange={(value) => (quantity = value)}
				/><button class="button" onclick={add}>Lägg i varukorgen →</button>
			</div>
			{#if added}<p class="toast detail-toast">Tillagd i varukorgen ♡</p>{/if}<small
				>Handgjort eller utvalt med omsorg.</small
			>
		</div>
	</section>
	{#if related.length}<section class="section">
			<ProductGrid items={related} title="Du kanske också gillar" />
		</section>{/if}
</main>
