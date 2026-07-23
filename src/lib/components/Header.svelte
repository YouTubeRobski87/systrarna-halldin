<script lang="ts">
	import { cartCount } from '$lib/stores/cart';
	import CartDrawer from './CartDrawer.svelte';
	let open = $state(false);
	let drawer = $state(false);
	const links = [
		{ href: '/butik', label: 'Butik' },
		{ href: '/galleri', label: 'Galleri' },
		{ href: '/om', label: 'Om oss' },
		{ href: '/kontakt', label: 'Kontakt' }
	];
</script>

<header>
	<div class="topline">Fri frakt på beställningar över 350 kr <span>♡</span></div>
	<nav>
		<button
			class="menu-toggle"
			aria-label={open ? 'Stäng meny' : 'Öppna meny'}
			aria-expanded={open}
			onclick={() => (open = !open)}>{open ? '×' : '☰'}</button
		>
		<a class="brand" href="/" aria-label="Systrarna Halldin, startsida"
			><span>SH</span><strong>Systrarna<br />Halldin</strong></a
		>
		<button class="cart-button" aria-label="Öppna varukorg" onclick={() => (drawer = true)}
			><span aria-hidden="true">🛍</span><span class="cart-label">Varukorg</span>{#if $cartCount}<em
					>{$cartCount}</em
				>{/if}</button
		>
		<div class:open class="nav-links">
			{#each links as link}<a href={link.href} onclick={() => (open = false)}>{link.label}</a
				>{/each}
		</div>
	</nav>
</header>
{#if drawer}<CartDrawer close={() => (drawer = false)} />{/if}
