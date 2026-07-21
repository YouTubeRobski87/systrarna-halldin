<script lang="ts">
	import { cart, cartTotal, updateBonusBead, updateQuantity } from '$lib/stores/cart';
	import { bonusBeads, hasBonusBeadOffer, type BonusBead } from '$lib/types/product';
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
			{#each $cart as item (`${item.product.id}-${item.bonusBead}`)}<div class="cart-item">
					<span class="mini-image"
						><img
							src={item.product.image}
							alt={item.product.imageAlt}
							width={item.product.imageWidth}
							height={item.product.imageHeight}
						/></span
					>
					<div>
						<b>{item.product.name}</b>
						{#if hasBonusBeadOffer(item.product.category)}
							<label
								class="bonus-select compact"
								for={`drawer-bonus-${item.product.id}-${item.bonusBead}`}
							>
								<span>Bonuspärla</span>
								<select
									id={`drawer-bonus-${item.product.id}-${item.bonusBead}`}
									value={item.bonusBead ?? bonusBeads[0]}
									onchange={(event) =>
										updateBonusBead(
											item.product.id,
											item.bonusBead,
											(event.currentTarget as HTMLSelectElement).value as BonusBead
										)}
								>
									{#each bonusBeads as bead}<option value={bead}>{bead}</option>{/each}
								</select>
							</label>
						{/if}
						<small>{currency(item.product.price)}</small>
						<div class="inline-qty">
							<button
								onclick={() => updateQuantity(item.product.id, item.quantity - 1, item.bonusBead)}
								>−</button
							><span>{item.quantity}</span><button
								onclick={() => updateQuantity(item.product.id, item.quantity + 1, item.bonusBead)}
								>+</button
							>
						</div>
					</div>
					<button
						class="remove"
						onclick={() => updateQuantity(item.product.id, 0, item.bonusBead)}
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
