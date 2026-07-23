<script lang="ts">
	import { currency } from '$lib/utils/currency';
	import { orderStatusLabels, paymentStatusLabels } from '$lib/order-status';
	import type { OrderRecord } from '$lib/server/orders';
	let { data }: { data: { orders: OrderRecord[]; paymentStatuses: readonly string[]; orderStatuses: readonly string[]; filters: { paymentStatus: string; orderStatus: string; search: string } } } = $props();
	const formatDate = (value: string) => new Intl.DateTimeFormat('sv-SE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
</script>

<svelte:head><title>Orderhantering – Systrarna Halldin</title></svelte:head>
<main class="page admin-page">
	<div class="admin-heading"><div><p class="eyebrow">Admin</p><h1>Beställningar</h1></div><form method="POST" action="/admin/logout"><button class="text-link" type="submit">Logga ut</button></form></div>
	<form class="admin-filters" method="GET">
		<label>Sök<input name="q" value={data.filters.search} placeholder="Ordernummer, namn, mejl eller telefon" /></label>
		<label>Betalning<select name="paymentStatus" value={data.filters.paymentStatus}><option value="all">Alla</option>{#each data.paymentStatuses as status}<option value={status}>{paymentStatusLabels[status as keyof typeof paymentStatusLabels]}</option>{/each}</select></label>
		<label>Orderstatus<select name="orderStatus" value={data.filters.orderStatus}><option value="all">Alla</option>{#each data.orderStatuses as status}<option value={status}>{orderStatusLabels[status as keyof typeof orderStatusLabels]}</option>{/each}</select></label>
		<button class="button" type="submit">Filtrera</button>
	</form>
	<p class="result-count">{data.orders.length} order{data.orders.length === 1 ? '' : 'ar'}</p>
	<section class="admin-order-list">
		{#each data.orders as order (order.id)}
			<article class="admin-order-row">
				<div><strong>{order.order_number}</strong><span>{formatDate(order.created_at)}</span></div>
				<div><b>{order.customer_name}</b><span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} produkter</span></div>
				<div><strong>{currency(order.total)}</strong><span class="status status-{order.payment_status}">{paymentStatusLabels[order.payment_status]}</span><span class="status status-{order.order_status}">{orderStatusLabels[order.order_status]}</span></div>
				<a class="button" href={`/admin/orders/${order.id}`}>Öppna</a>
			</article>
		{:else}<p>Inga order matchar filtren.</p>{/each}
	</section>
</main>
