<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import CategoryCard from '$lib/components/CategoryCard.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import TrustBar from '$lib/components/TrustBar.svelte';
	import { products } from '$lib/data/products';
	const featured = products.filter((product) => product.featured);
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
		content="Handgjorda armband, nyckelringar och små favoriter av Alma & Emilia."
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
	<section class="section">
		<div class="section-heading centered">
			<p class="eyebrow">Hitta din favorit</p>
			<h2>Små saker att tycka om</h2>
			<p>Varje sak är vald eller skapad med extra omsorg.</p>
		</div>
		<div class="category-grid">
			<CategoryCard
				name="Armband"
				icon="◌"
				text="Pärlor, färg och glädje"
				color="pink"
			/><CategoryCard
				name="Nyckelringar"
				icon="✦"
				text="Till nycklar och väskor"
				color="mint"
			/><CategoryCard name="Squishies" icon="●" text="Mjuka små favoriter" color="lavender" />
		</div>
	</section>
	<section class="section featured">
		<ProductGrid items={featured} title="Utvalt just nu" /><a
			class="text-link all-link"
			href="/butik">Se hela butiken →</a
		>
	</section>
	<TrustBar />
	<section class="story">
		<div class="story-art">
			<span>♡</span>
			<div>Alma<br />& Emilia</div>
		</div>
		<div>
			<p class="eyebrow">Från vår lilla verkstad</p>
			<h2>Vi gillar att skapa saker som gör vardagen lite gladare.</h2>
			<p>
				Allt började med pärlor på köksbordet och en idé om en egen liten butik. Nu väljer och gör
				vi våra favoriter tillsammans.
			</p>
			<a class="text-link" href="/om">Läs mer om oss →</a>
		</div>
	</section>
	<aside class="notice">
		<span>✦</span>
		<div>
			<b>Beställ tryggt här på webbplatsen</b>
			<p>Vi tar inte emot beställningar eller betalningar via Instagram eller DM.</p>
		</div>
	</aside>
</main>
