<script lang="ts">
	import { products } from '$lib/data/products';

	const collage = [
		products.find((product) => product.category === 'Armband'),
		products.find((product) => product.category === 'Pärlplattor'),
		products.find((product) => product.category === 'Nyckelringar'),
		products.find((product) => product.category === 'Pappers-squishies')
	].filter((product) => product !== undefined);
</script>

<section class="hero">
	<div class="hero-copy">
		<p class="eyebrow">Alma & Emilias lilla verkstad</p>
		<h1>Handgjort med <i>hjärta.</i></h1>
		<p class="lead">
			Färgglada små ting att bära, ge bort och bli glad av — skapade för hand, ett exemplar i taget.
		</p>
		<div class="actions">
			<a class="button" href="/butik">Shoppa nu <span>→</span></a>
			<a class="secondary-button" href="/galleri">Se galleriet</a>
		</div>
		<p class="hero-note"><span aria-hidden="true">✦</span> Små upplagor · skapade med fantasi</p>
	</div>

	<div class="hero-collage" aria-label="Ett urval av handgjorda produkter">
		<span class="collage-shape shape-peach" aria-hidden="true"></span>
		<span class="collage-shape shape-lilac" aria-hidden="true"></span>
		<span class="collage-sparkle sparkle-one" aria-hidden="true">✦</span>
		<span class="collage-sparkle sparkle-two" aria-hidden="true">♡</span>
		{#each collage as product, index (product.id)}
			<a class={`collage-card collage-card-${index + 1}`} href={`/produkt/${product.slug}`}>
				<img
					src={product.image}
					alt={product.imageAlt}
					width={product.imageWidth}
					height={product.imageHeight}
				/>
			</a>
		{/each}
	</div>
</section>
