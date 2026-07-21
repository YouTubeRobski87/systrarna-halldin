<script lang="ts">
	import { SWISH_NUMBER, isSwishConfigured } from '$lib/config/payment';
	import { cart, cartTotal, clearCart, type CartItem } from '$lib/stores/cart';
	import { createOrderNumber, PENDING_PAYMENT_STATUS, type SubmittedOrder } from '$lib/utils/order';
	import { currency } from '$lib/utils/currency';

	let submittedOrder = $state<SubmittedOrder | null>(null);
	let error = $state('');

	function submit(event: SubmitEvent) {
		const form = event.currentTarget as HTMLFormElement;
		if (!isSwishConfigured) {
			error =
				'Swishuppgifterna är ännu inte aktiverade. Det går inte att skicka en riktig beställning ännu.';
			return;
		}
		if (!form.checkValidity() || !$cart.length) {
			error = 'Fyll i alla obligatoriska uppgifter och godkänn villkoren.';
			return;
		}

		error = '';
		submittedOrder = {
			orderNumber: createOrderNumber(),
			items: $cart.map((item) => ({ ...item })),
			total: $cartTotal,
			status: PENDING_PAYMENT_STATUS
		};
		clearCart();
	}

	const orderItems = (items: CartItem[]) => items;
</script>

{#if submittedOrder}
	<section class="confirmation payment-confirmation" aria-live="polite">
		<span>♡</span>
		<p class="eyebrow">Orderbekräftelse</p>
		<h1>Tack för din beställning!</h1>
		<div class="confirmation-details">
			<p><strong>Ordernummer:</strong><br />{submittedOrder.orderNumber}</p>
			<p><strong>Att betala:</strong><br />{currency(submittedOrder.total)}</p>
			<p><strong>Swisha till:</strong><br />{SWISH_NUMBER}</p>
			<p><strong>Meddelande:</strong><br />{submittedOrder.orderNumber}</p>
		</div>
		<p>
			Din beställning har status “{submittedOrder.status}”. Vi börjar behandla den när
			Swish-betalningen har kommit in.
		</p>
		<a class="button" href="/butik">Fortsätt shoppa</a>
	</section>
{:else}
	<form
		class="order-form"
		onsubmit={(event) => {
			event.preventDefault();
			submit(event);
		}}
	>
		<div class="form-section">
			<h2>Dina uppgifter</h2>
			<label>Namn<input required name="name" autocomplete="name" /></label><label
				>E-post<input required type="email" name="email" autocomplete="email" /></label
			>
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
				><label>Ort<input required name="city" autocomplete="address-level2" /></label>
			</div>
			<fieldset>
				<legend>Leveranssätt</legend><label class="radio"
					><input type="radio" name="delivery" checked /> Brev hem till dig</label
				><label class="radio"><input type="radio" name="delivery" /> Överenskommes via e-post</label
				>
			</fieldset>
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
				När du skickat beställningen får du ett ordernummer. Swisha sedan totalsumman och skriv
				ordernumret som meddelande. Beställningen behandlas när betalningen har kommit in.
			</p>
			{#if !isSwishConfigured}
				<p class="payment-not-ready" role="status">
					Swishuppgifterna är ännu inte aktiverade. Riktiga beställningar kan inte skickas ännu.
				</p>
			{/if}
		</section>
		<p class="manual-payment-note">
			Genom att skicka beställningen godkänner du att betalning sker manuellt via Swish.
			Beställningen är inte betald förrän Swish-betalningen har mottagits.
		</p>
		{#if error}<p class="form-error" role="alert">{error}</p>{/if}
		<button class="button" type="submit" disabled={!isSwishConfigured}>Skicka beställning</button>
	</form>
{/if}

<aside class="order-summary">
	<h2>{submittedOrder ? 'Ordersammanfattning' : 'Din beställning'}</h2>
	{#if submittedOrder}
		<p><strong>Ordernummer:</strong> {submittedOrder.orderNumber}</p>
		<p><strong>Betalningsstatus:</strong> {submittedOrder.status}</p>
		{#each orderItems(submittedOrder.items) as item (`${item.product.id}-${item.bonusBead}`)}
			<div>
				<span
					>{item.quantity} × {item.product.name}{#if item.bonusBead}<small
							>Bonuspärla: {item.bonusBead}</small
						>{/if}</span
				>
				<b>{currency(item.product.price * item.quantity)}</b>
			</div>
		{/each}
		<hr />
		<div><span>Delsumma</span><b>{currency(submittedOrder.total)}</b></div>
		<div><span>Frakt</span><b>Beräknas vid order</b></div>
		<div class="summary-total">
			<span>Totalt</span><strong>{currency(submittedOrder.total)}</strong>
		</div>
	{:else if $cart.length}
		{#each $cart as item (`${item.product.id}-${item.bonusBead}`)}
			<div>
				<span
					>{item.quantity} × {item.product.name}{#if item.bonusBead}<small
							>Bonuspärla: {item.bonusBead}</small
						>{/if}</span
				>
				<b>{currency(item.product.price * item.quantity)}</b>
			</div>
		{/each}
		<hr />
		<div><span>Delsumma</span><b>{currency($cartTotal)}</b></div>
		<div><span>Frakt</span><b>Beräknas vid order</b></div>
		<div class="summary-total"><span>Totalt</span><strong>{currency($cartTotal)}</strong></div>
		<p>Betalning sker efter skickad beställning via Swish.</p>
	{:else}
		<p>Din varukorg är tom.</p>
		<a href="/butik">Till butiken</a>
	{/if}
</aside>
