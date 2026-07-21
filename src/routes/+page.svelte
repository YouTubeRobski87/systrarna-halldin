<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import TrustBar from '$lib/components/TrustBar.svelte';
	import { products } from '$lib/data/products';
	const featured = products.filter((product) => product.featured);
	const makingSteps = [
		{
			title: 'Väljer pärlor',
			text: 'Färger, former och detaljer väljs ut för varje ny skapelse.'
		},
		{
			title: 'Provar en idé',
			text: 'Olika kombinationer testas tills allt känns rätt.'
		},
		{
			title: 'Skapar för hand',
			text: 'Armband och nyckelringar sätts ihop med stor omsorg.'
		},
		{
			title: 'Färdig skapelse',
			text: 'Varje färdig produkt blir unik på sitt eget sätt.'
		}
	];
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
	<section class="section featured">
		<ProductGrid items={featured} title="Utvalt just nu" /><a
			class="text-link all-link"
			href="/butik">Se hela butiken →</a
		>
	</section>
	<TrustBar />
	<section class="section personal">
		<div class="section-heading centered">
			<p class="eyebrow">Från vår lilla verkstad</p>
			<h2>Skapat av oss</h2>
			<p>
				Systrarna Halldin är vår lilla butik med handgjorda armband, nyckelringar och andra saker vi
				själva tycker om att skapa.
			</p>
		</div>
		<div class="signature-cards">
			<article class="signature-card alma-card">
				<img
					src="/images/handritat/alma-star-transparent.png"
					alt="Almas handritade stjärna"
					width="1536"
					height="1024"
				/>
				<div>
					<h3>Alma</h3>
					<p>Almas handritade stjärna</p>
				</div>
			</article>
			<article class="signature-card emilia-card">
				<img
					src="/images/handritat/emilia-the-star-transparent.png"
					alt="Emilias handritade stjärna med texten The star"
					width="918"
					height="588"
				/>
				<div>
					<h3>Emilia</h3>
					<p>Emilias handritade stjärna</p>
				</div>
			</article>
		</div>
	</section>
	<section class="section making">
		<div class="making-image">
			<img
				src="/images/behind-the-scenes/parlor-och-material.jpg"
				alt="Pärlor och material som används när Alma och Emilia skapar"
				width="1536"
				height="2048"
			/>
		</div>
		<div class="making-content">
			<p class="eyebrow">Bakom kulisserna</p>
			<h2>Så skapar vi</h2>
			<p class="making-intro">
				Varje armband och nyckelring börjar bland pärlor, färger och idéer. Alma och Emilia väljer
				själva kombinationer och skapar varje produkt för hand.
			</p>
			<ol class="making-steps">
				{#each makingSteps as step, index}
					<li>
						<span>{index + 1}</span>
						<div>
							<h3>{step.title}</h3>
							<p>{step.text}</p>
						</div>
					</li>
				{/each}
			</ol>
		</div>
	</section>
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
