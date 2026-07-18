<script lang="ts">
	import OrderForm from '$lib/components/OrderForm.svelte';
</script>

<svelte:head
	><title>Kassa – Systrarna Halldin</title><meta
		name="description"
		content="Skicka din beställningsförfrågan tryggt hos Systrarna Halldin."
	/></svelte:head
>
<main class="page checkout">
	<p class="eyebrow">Trygg beställningsförfrågan</p>
	<h1>Din kassa</h1>
	<p class="intro">
		Fyll i dina uppgifter så återkommer ansvarig vuxen med bekräftelse och betalningsinformation.
	</p>
	<div class="checkout-grid"><OrderForm /></div>
</main>
