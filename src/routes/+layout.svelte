<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head
	><link rel="icon" href={favicon} /><meta property="og:type" content="website" /><meta
		property="og:locale"
		content="sv_SE"
	/></svelte:head
>
<Header />
{@render children()}
<Footer />
