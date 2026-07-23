<script lang="ts">
	import { page } from '$app/state';

	const isNotFound = () => page.status === 404;
</script>

<svelte:head>
	<title>{isNotFound() ? 'Sidan hittades inte' : 'Något gick fel'} – Systrarna Halldin</title>
</svelte:head>

<main class="error-page">
	<span>✦</span>
	<p class="eyebrow">{page.status}</p>
	{#if isNotFound()}
		<h1>Här fanns visst inget.</h1>
		<p>Sidan du letar efter kan ha flyttat eller aldrig funnits.</p>
	{:else}
		<h1>Något gick inte att läsa in.</h1>
		<p>Försök igen om en liten stund. Kontakta oss om problemet kvarstår.</p>
	{/if}
	<a class="button" href="/">Till startsidan →</a>
</main>
