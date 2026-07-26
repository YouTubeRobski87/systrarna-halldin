<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import TrustBar from '$lib/components/TrustBar.svelte';
	import { products } from '$lib/data/products';

	const nyinkommet = products.filter((product) => product.isNew);
	const almaFavoriter = products
		.filter((product) => ['Armband', 'Pärlplattor'].includes(product.category))
		.slice(0, 4);
	const emiliaFavoriter = products
		.filter((product) =>
			['Nyckelringar', 'Pappers-squishies', 'Klistermärken'].includes(product.category)
		)
		.slice(0, 4);
	const structuredData = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Store',
		name: 'Systrarna Halldin',
		url: 'https://systrarnahalldin.se',
		description: 'Handgjorda små favoriter av Alma & Emilia'
	});
</script>

<svelte:head
	><title>Systrarna Halldin – Handgjort av Alma & Emilia</title><meta
		name="description"
		content="Handgjorda armband, nyckelringar och små favoriter av Alma och Emilia."
	/><link rel="canonical" href="https://systrarnahalldin.se/" /><meta
		property="og:title"
		content="Systrarna Halldin"
	/><meta
		property="og:description"
		content="Handgjort av Alma & Emilia"
	/>{@html '<script type="application/ld+json">' + structuredData + '<' + '/script>'}</svelte:head
>

<Hero />
<main>
	<section class="section collection-section new-arrivals">
		<div class="collection-heading">
			<div>
				<p class="eyebrow">Precis klart från verkstaden</p>
				<h2>Nyinkommet</h2>
			</div>
			<a class="text-link" href="/butik">Se allt nytt →</a>
		</div>
		<ProductGrid items={nyinkommet} />
	</section>

	<TrustBar />

	<section class="section collection-section favourite-section alma-favourites">
		<div class="collection-heading">
			<div>
				<p class="eyebrow">Almas urval</p>
				<h2>Almas favoriter</h2>
				<p>Utvalda saker som Alma tycker extra mycket om.</p>
			</div>
			<span class="handwritten-note">färgglatt!</span>
		</div>
		<ProductGrid items={almaFavoriter} />
	</section>

	<section class="section collection-section favourite-section emilia-favourites">
		<div class="collection-heading">
			<div>
				<p class="eyebrow">Emilias urval</p>
				<h2>Emilias favoriter</h2>
				<p>Emilias egna favoriter med lite extra fantasi.</p>
			</div>
			<span class="handwritten-note">så kul!</span>
		</div>
		<ProductGrid items={emiliaFavoriter} />
	</section>

	<section class="handmade-promise">
		<div>
			<p class="eyebrow">Från idé till favorit</p>
			<h2>Handgjort av oss.</h2>
		</div>
		<div class="promise-points">
			<article>
				<span>01</span>
				<h3>Handgjort</h3>
				<p>Varje detalj får ta den tid den behöver.</p>
			</article>
			<article>
				<span>02</span>
				<h3>Unika exemplar</h3>
				<p>Små serier med egen färg och personlighet.</p>
			</article>
			<article>
				<span>03</span>
				<h3>Skapat med fantasi</h3>
				<p>Vi börjar med en idé och låter den bli till.</p>
			</article>
		</div>
	</section>

	<section class="shop-cta">
		<span class="cta-sparkle" aria-hidden="true">✦</span>
		<p class="eyebrow">Vår lilla webbshop</p>
		<h2>Upptäck allt vi har skapat</h2>
		<p>Hitta en ny favorit bland våra handgjorda små ting.</p>
		<a class="button" href="/butik">Till butiken <span>→</span></a>
	</section>
</main>
