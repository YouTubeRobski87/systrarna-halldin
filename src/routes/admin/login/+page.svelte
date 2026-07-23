<script lang="ts">
	let { form }: { form?: { message?: string } } = $props();
</script>

<svelte:head><title>Admininloggning – Systrarna Halldin</title></svelte:head>
<main class="page admin-login">
	<section class="admin-card">
		<p class="eyebrow">Endast för administratör</p>
		<h1>Logga in</h1>
		<p>Hantera beställningar och matcha Swish-betalningar.</p>
		<form method="POST" class="order-form">
			<label
				>Lösenord<input
					name="password"
					type="password"
					autocomplete="current-password"
					required
				/></label
			>
			{#if form?.message}<p class="form-error" role="alert">{form.message}</p>{/if}
			<button class="button" type="submit">Logga in</button>
		</form>
	</section>
</main>
