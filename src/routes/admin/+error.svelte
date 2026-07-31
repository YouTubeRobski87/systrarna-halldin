<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head><title>Adminfel – Systrarna Halldin</title></svelte:head>
<main class="page admin-page">
	<section class="admin-card">
		<p class="eyebrow">Admin</p>
		<h1>Orderhanteringen är tillfälligt otillgänglig</h1>
		<p>{page.error?.message ?? 'Ett oväntat fel uppstod. Försök igen senare.'}</p>
		<a class="button" href="/admin/orders">Försök igen</a>
	</section>
</main>
