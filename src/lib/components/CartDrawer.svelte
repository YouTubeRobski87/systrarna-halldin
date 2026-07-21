<script lang="ts">
	import { cart, cartTotal, updateQuantity } from '$lib/stores/cart';
	import { currency } from '$lib/utils/currency';
	let { close }: { close: () => void } = $props();
</script>

<div class="drawer-backdrop" role="presentation" onclick={close}></div>
<aside class="drawer" aria-label="Din varukorg">
	<div class="drawer-head">
		<h2>Din varukorg</h2>
		<button onclick={close} aria-label="Stäng varukorg">×</button>
	</div>
	{#if $cart.length}<div class="cart-list">
			{#each $cart as item (`${item.product.id}-${item.variation}`)}<div class="cart-item">
					<span class="mini-image"
						>{#if item.product.image.startsWith('/')}
							<img
								src={item.product.image}
								alt={item.product.imageAlt}
								width={item.product.imageWidth}
								height={item.product.imageHeight}
							/>
						{:else}{item.product.image}{/if}</span
					>
					<div>
						<b>{item.product.name}</b>{#if item.variation}<small>{item.variation}</small>{/if}<small
							>{currency(item.product.price)}</small
						>
						<div class="inline-qty">
							<button
								onclick={() => updateQuantity(item.product.id, item.quantity - 1, item.variation)}
								>−</button
							><span>{item.quantity}</span><button
								onclick={() => updateQuantity(item.product.id, item.quantity + 1, item.variation)}
								>+</button
							>
						</div>
					</div>
					<button
						class="remove"
						onclick={() => updateQuantity(item.product.id, 0, item.variation)}
						aria-label="Ta bort">×</button
					>
				</div>{/each}
		</div>
		<div class="drawer-total"><span>Totalt</span><strong>{currency($cartTotal)}</strong></div>
		<a class="button full" href="/kassa" onclick={close}>Till kassan →</a><a
			class="drawer-link"
			href="/varukorg"
			onclick={close}>Visa hela varukorgen</a
		>{:else}<div class="empty">
			<span>🛍</span>
			<h3>Här var det tomt</h3>
			<p>Hitta något handgjort som gör dig glad.</p>
			<a class="button" href="/butik" onclick={close}>Till butiken</a>
		</div>{/if}
</aside>
