<script lang="ts">
	import { enhance } from '$app/forms';
	import { SWISH_NUMBER, isSwishConfigured } from '$lib/config/payment';
	import { cart, cartTotal, clearCart, updateBonusBead, type CartItem } from '$lib/stores/cart';
	import { bonusBeads, hasBonusBeadOffer, type BonusBead } from '$lib/types/product';
	import { currency } from '$lib/utils/currency';

	type SavedOrder = {
		order_number: string;
		total: number;
		payment_status: string;
		order_status: string;
	};
	let submittedOrder = $state<SavedOrder | null>(null);
	let error = $state('');
	let submitting = $state(false);
	const serializedItems = $derived(
		JSON.stringify($cart.map((item) => ({ productId: item.product.id, quantity: item.quantity })))
	);

	const orderItems = (items: CartItem[]) => items;
</script>

{#if submittedOrder}
	<section class="confirmation payment-confirmation" aria-live="polite">
		<span>♡</span>
		<p class="eyebrow">Orderbekräftelse</p>
		<h1>Tack för din beställning!</h1>
		<div class="confirmation-details">
			<p><strong>Ordernummer:</strong><br />{submittedOrder.order_number}</p>
			<p><strong>Att betala:</strong><br />{currency(submittedOrder.total)}</p>
			<p><strong>Swisha till:</strong><br />{SWISH_NUMBER}</p>
			<p><strong>Meddelande:</strong><br />{submittedOrder.order_number}</p>
		</div>
		<p>
			Din beställning är sparad och väntar på betalning. Skriv alltid ordernumret som
			Swish-meddelande, så kan vi matcha din betalning.
		</p>
		<a class="button" href="/butik">Fortsätt shoppa</a>
	</section>
{:else}
	<form
		class="order-form"
		method="POST"
		action="?/createOrder"
		use:enhance={({ formData }) => {
			error = '';
			submitting = true;
			formData.set('items', serializedItems);
			return async ({ result, update }) => {
				submitting = false;
				if (result.type === 'success' && result.data?.order) {
					submittedOrder = result.data.order as SavedOrder;
					clearCart();
					return;
				}
				error =
					result.type === 'failure'
						? String(result.data?.message ?? 'Kunde inte spara ordern.')
						: 'Kunde inte spara ordern.';
				await update();
			};
		}}
	>
		<input type="hidden" name="items" value={serializedItems} />
		<div class="form-section">
			<h2>Dina uppgifter</h2>
			<label>Namn<input required name="name" autocomplete="name" /></label>
			<label>E-post<input required type="email" name="email" autocomplete="email" /></label>
			<label>Telefon<input required type="tel" name="phone" autocomplete="tel" /></label>
		</div>
		<div class="form-section">
			<h2>Leverans</h2>
			<label>Adress<input required name="address" autocomplete="street-address" /></label>
			<div class="two-cols">
				<label
					>Postnummer<input
						required
						name="postal"
						pattern="[0-9 ][0-9 ][0-9 ][0-9 ][0-9]"
						autocomplete="postal-code"
					/></label
				>
				<label>Ort<input required name="city" autocomplete="address-level2" /></label>
			</div>
			<label>Kommentar <small>(valfritt)</small><textarea name="comment" rows="4"></textarea></label
			>
		</div>
		<label class="terms"
			><input required type="checkbox" /> Jag har läst och godkänner
			<a href="/villkor">köpvillkoren</a>.</label
		>
		<section class="payment-info" aria-labelledby="swish-heading">
			<h2 id="swish-heading">Betalning med Swish</h2>
			<p>
				När ordern är sparad får du ett ordernummer. Swisha totalsumman och skriv ordernumret som
				meddelande.
			</p>
			{#if !isSwishConfigured}<p class="payment-not-ready" role="status">
					Swishuppgifterna är ännu inte aktiverade.
				</p>{/if}
		</section>
		<p class="manual-payment-note">
			Beställningen är inte betald förrän Swish-betalningen har mottagits och matchats mot
			ordernumret.
		</p>
		{#if error}<p class="form-error" role="alert">{error}</p>{/if}
		<button
			class="button"
			type="submit"
			disabled={!isSwishConfigured || !$cart.length || submitting}
			>{submitting ? 'Sparar order …' : 'Skicka beställning'}</button
		>
	</form>
{/if}

<aside class="order-summary">
	<h2>{submittedOrder ? 'Ordersammanfattning' : 'Din beställning'}</h2>
	{#if submittedOrder}
		<p><strong>Ordernummer:</strong> {submittedOrder.order_number}</p>
		<p><strong>Betalningsstatus:</strong> Väntar på betalning</p>
		<p><strong>Orderstatus:</strong> Ny</p>
		<div class="summary-total">
			<span>Totalt</span><strong>{currency(submittedOrder.total)}</strong>
		</div>
	{:else if $cart.length}
		{#each orderItems($cart) as item (`${item.product.id}-${item.bonusBead}`)}
			<div>
				<span
					>{item.quantity} × {item.product.name}
					{#if hasBonusBeadOffer(item.product.category)}
						<label
							class="bonus-select compact"
							for={`checkout-bonus-${item.product.id}-${item.bonusBead}`}
							><span>Bonuspärla:</span><select
								id={`checkout-bonus-${item.product.id}-${item.bonusBead}`}
								value={item.bonusBead ?? bonusBeads[0]}
								onchange={(event) =>
									updateBonusBead(
										item.product.id,
										item.bonusBead,
										(event.currentTarget as HTMLSelectElement).value as BonusBead
									)}
								>{#each bonusBeads as bead}<option value={bead}>{bead}</option>{/each}</select
							></label
						>
					{/if}
				</span><b>{currency(item.product.price * item.quantity)}</b>
			</div>
		{/each}
		<hr />
		<div><span>Delsumma</span><b>{currency($cartTotal)}</b></div>
		<div><span>Frakt</span><b>0 kr</b></div>
		<div class="summary-total"><span>Totalt</span><strong>{currency($cartTotal)}</strong></div>
		<p>Betalning sker efter skickad beställning via Swish.</p>
	{:else}
		<p>Din varukorg är tom.</p>
		<a href="/butik">Till butiken</a>
	{/if}
</aside>
