<script lang="ts">
	import { cartCount } from '$lib/stores/cart';
	import CartDrawer from './CartDrawer.svelte';
	let open = $state(false);
	let drawer = $state(false);
	const links = [
		{ href: '/butik', label: 'Butik' },
		{ href: '/om', label: 'Om oss' },
		{ href: '/kontakt', label: 'Kontakt' }
	];
</script>

<header>
	<div class="topline">Fri frakt på beställningar över 350 kr <span>♡</span></div>
	<nav>
		<a class="brand" href="/" aria-label="Systrarna Halldin, startsida"
			><span>SH</span><strong>Systrarna<br />Halldin</strong></a
		><button
			class="menu-toggle"
			aria-label="Öppna meny"
			aria-expanded={open}
			onclick={() => (open = !open)}>☰</button
		>
		<div class:open class="nav-links">
			{#each links as link}<a href={link.href} onclick={() => (open = false)}>{link.label}</a
				>{/each}
		</div>
		<button class="cart-button" aria-label="Öppna varukorg" onclick={() => (drawer = true)}
			>🛍 <span>Varukorg</span>{#if $cartCount}<em>{$cartCount}</em>{/if}</button
		>
	</nav>
</header>
{#if drawer}<CartDrawer close={() => (drawer = false)} />{/if}
