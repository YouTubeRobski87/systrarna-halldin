<script lang="ts">
	import { cart, cartTotal, clearCart } from '$lib/stores/cart';
	import { currency } from '$lib/utils/currency';
	let submitted = $state(false);
	let error = $state('');
	function submit(event: SubmitEvent) {
		const form = event.currentTarget as HTMLFormElement;
		if (!form.checkValidity() || !$cart.length) {
			error = 'Fyll i alla obligatoriska uppgifter och godkänn villkoren.';
			return;
		}
		error = '';
		submitted = true;
		clearCart();
	}
</script>

{#if submitted}<section class="confirmation">
		<span>♡</span>
		<p class="eyebrow">Tack för din förfrågan</p>
		<h1>Vi har tagit emot din beställning.</h1>
		<p>Ansvarig vuxen återkommer via e-post med bekräftelse och information om betalning.</p>
		<a class="button" href="/butik">Fortsätt shoppa</a>
	</section>{:else}<form
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
		>{#if error}<p class="form-error" role="alert">{error}</p>{/if}<button
			class="button"
			type="submit">Skicka beställningsförfrågan →</button
		>
	</form>{/if}
<aside class="order-summary">
	<h2>Din beställning</h2>
	{#if $cart.length}{#each $cart as item}<div>
				<span
					>{item.quantity} × {item.product.name}{#if item.bonusBead}<small
							>Bonuspärla: {item.bonusBead}</small
						>{/if}</span
				><b>{currency(item.product.price * item.quantity)}</b>
			</div>{/each}
		<hr />
		<div class="summary-total"><span>Totalt</span><strong>{currency($cartTotal)}</strong></div>
		<p>Ingen betalning sker nu. Vi återkommer med orderbekräftelse.</p>{:else}<p>
			Din varukorg är tom.
		</p>
		<a href="/butik">Till butiken</a>{/if}
</aside>
