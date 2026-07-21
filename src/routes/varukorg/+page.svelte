<script lang="ts">
	import { cart, cartTotal, updateQuantity } from '$lib/stores/cart';
	import { currency } from '$lib/utils/currency';
</script>

<svelte:head
	><title>Varukorg – Systrarna Halldin</title><meta
		name="description"
		content="Din varukorg hos Systrarna Halldin."
	/></svelte:head
>
<main class="page cart-page">
	<p class="eyebrow">Din beställning</p>
	<h1>Varukorg</h1>
	{#if $cart.length}<div class="cart-page-grid">
			<section class="cart-list large">
				{#each $cart as item (`${item.product.id}-${item.variation}`)}<article class="cart-item">
						<span class="mini-image"
							><img
								src={item.product.image}
								alt={item.product.imageAlt}
								width={item.product.imageWidth}
								height={item.product.imageHeight}
							/></span
						>
						<div class="cart-product">
							<h2>{item.product.name}</h2>
							{#if item.variation}<p>{item.variation}</p>{/if}<b>{currency(item.product.price)}</b>
						</div>
						<div class="inline-qty">
							<button
								onclick={() => updateQuantity(item.product.id, item.quantity - 1, item.variation)}
								>−</button
							><span>{item.quantity}</span><button
								onclick={() => updateQuantity(item.product.id, item.quantity + 1, item.variation)}
								>+</button
							>
						</div>
						<strong>{currency(item.product.price * item.quantity)}</strong><button
							class="remove"
							onclick={() => updateQuantity(item.product.id, 0, item.variation)}>Ta bort</button
						>
					</article>{/each}
			</section>
			<aside class="cart-summary">
				<h2>Sammanfattning</h2>
				<div><span>Delsumma</span><b>{currency($cartTotal)}</b></div>
				<div><span>Frakt</span><b>{$cartTotal >= 350 ? 'Gratis' : 'Beräknas vid order'}</b></div>
				<hr />
				<div class="summary-total"><span>Totalt</span><strong>{currency($cartTotal)}</strong></div>
				<a class="button full" href="/kassa">Till kassan →</a>
				<p>Ingen betalning sker i detta steg.</p>
			</aside>
		</div>{:else}<section class="empty-page">
			<span>🛍</span>
			<h2>Din varukorg är tom</h2>
			<p>Ta en titt i vår lilla butik och hitta något handgjort.</p>
			<a class="button" href="/butik">Till butiken →</a>
		</section>{/if}
</main>
