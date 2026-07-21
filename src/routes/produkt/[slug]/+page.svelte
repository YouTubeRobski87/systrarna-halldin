<script lang="ts">
	import type { PageData } from './$types';
	import { products } from '$lib/data/products';
	import { addToCart } from '$lib/stores/cart';
	import { currency } from '$lib/utils/currency';
	import { bonusBeads, hasBonusBeadOffer, type BonusBead } from '$lib/types/product';
	import QuantitySelector from '$lib/components/QuantitySelector.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	let { data }: { data: PageData } = $props();
	let quantity = $state(1);
	let bonusBead = $state<BonusBead>(bonusBeads[0]);
	let added = $state(false);
	const canChooseBonusBead = $derived(hasBonusBeadOffer(data.product.category));
	const madeByStar = $derived(
		data.product.madeBy === 'Alma'
			? '/images/handritat/alma-star-transparent.png'
			: data.product.madeBy === 'Emilia'
				? '/images/handritat/emilia-the-star-transparent.png'
				: undefined
	);
	let structuredData = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Product',
			name: data.product.name,
			description: data.product.description,
			offers: {
				'@type': 'Offer',
				price: data.product.price,
				priceCurrency: 'SEK'
			}
		})
	);
	const related = $derived(
		products
			.filter((p) => p.category === data.product.category && p.id !== data.product.id)
			.slice(0, 3)
	);
	function add() {
		addToCart(data.product, canChooseBonusBead ? bonusBead : undefined, quantity);
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
			<img
				src={data.product.image}
				alt={data.product.imageAlt}
				width={data.product.imageWidth}
				height={data.product.imageHeight}
			/>
		</div>
		<div class="detail-copy">
			<p class="eyebrow">{data.product.category}</p>
			<h1>{data.product.name}</h1>
			<strong class="price">{currency(data.product.price)}</strong>
			{#if canChooseBonusBead}
				<div class="product-promises">
					<p>🎁 Extra pärla medföljer</p>
					<p>Handgjord av Alma & Emilia ❤️</p>
				</div>
			{/if}
			<p class="description">{data.product.description}</p>
			{#if data.product.madeBy && madeByStar}<p class="made-by">
					<img
						src={madeByStar}
						alt=""
						aria-hidden="true"
						width={data.product.madeBy === 'Alma' ? 1536 : 918}
						height={data.product.madeBy === 'Alma' ? 1024 : 588}
					/>
					<span>Tillverkad av {data.product.madeBy}</span>
				</p>{/if}
			{#if canChooseBonusBead}<fieldset class="bonus-beads">
					<legend>Välj en gratis bonuspärla</legend>
					<p>
						En extra pärla skickas med som ett litet tillbehör. Den är inte monterad på produkten.
					</p>
					<div class="bonus-bead-options">
						{#each bonusBeads as bead}
							<label class:chosen={bonusBead === bead}>
								<input type="radio" name="bonus-bead" value={bead} bind:group={bonusBead} />
								<span class="bonus-bead-dot" data-bead={bead} aria-hidden="true"></span>
								<span>{bead}</span>
							</label>
						{/each}
					</div>
				</fieldset>{/if}
			<div class="purchase">
				<QuantitySelector
					value={quantity}
					max={99}
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
