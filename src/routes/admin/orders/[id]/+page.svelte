<script lang="ts">
	import { currency } from '$lib/utils/currency';
	import { orderStatusLabels, paymentStatusLabels } from '$lib/order-status';
	import type { OrderRecord } from '$lib/server/orders';
	let { data, form }: { data: { order: OrderRecord }; form?: { success?: boolean; message?: string } } = $props();
	const formatDate = (value: string) => new Intl.DateTimeFormat('sv-SE', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(value));
</script>

<svelte:head><title>{data.order.order_number} – Admin</title></svelte:head>
<main class="page admin-page">
	<a class="back-link" href="/admin/orders">← Alla beställningar</a>
	<div class="admin-heading"><div><p class="eyebrow">Ordernummer</p><h1>{data.order.order_number}</h1><p>{formatDate(data.order.created_at)}</p></div><form method="POST" action="/admin/logout"><button class="text-link" type="submit">Logga ut</button></form></div>
	{#if form?.success}<p class="admin-success" role="status">Orderstatusen är sparad.</p>{/if}{#if form?.message}<p class="form-error" role="alert">{form.message}</p>{/if}
	<div class="admin-detail-grid">
		<section class="admin-card"><h2>Kunduppgifter</h2><p><b>{data.order.customer_name}</b><br />{data.order.customer_email}<br />{data.order.customer_phone}</p><h3>Leveransadress</h3><p>{data.order.address}<br />{data.order.postal_code} {data.order.city}</p>{#if data.order.customer_message}<h3>Meddelande</h3><p>{data.order.customer_message}</p>{/if}</section>
		<section class="admin-card"><h2>Betalning och leverans</h2><p>Betalsätt: <b>Swish</b></p><p>Sök Swish-betalningen med meddelandet <strong>{data.order.order_number}</strong> och markera sedan som betald.</p><form method="POST" action="?/update" class="order-form"><label>Betalstatus<select name="paymentStatus" value={data.order.payment_status}><option value="pending">{paymentStatusLabels.pending}</option><option value="paid">{paymentStatusLabels.paid}</option></select></label><label>Orderstatus<select name="orderStatus" value={data.order.order_status}><option value="new">{orderStatusLabels.new}</option><option value="packing">{orderStatusLabels.packing}</option><option value="shipped">{orderStatusLabels.shipped}</option><option value="cancelled">{orderStatusLabels.cancelled}</option></select></label><button class="button" type="submit">Spara status</button></form></section>
	</div>
	<section class="admin-card admin-items"><h2>Produkter</h2>{#each data.order.items as item (item.productId)}<article><img src={item.image} alt="" width="80" height="80" /><div><b>{item.name}</b><span>{item.quantity} × {currency(item.price)}</span>{#if item.creator}<small>Skapad av {item.creator}</small>{/if}</div><strong>{currency(item.quantity * item.price)}</strong></article>{/each}<hr /><div class="admin-totals"><span>Delsumma <b>{currency(data.order.subtotal)}</b></span><span>Frakt <b>{currency(data.order.shipping_cost)}</b></span><strong>Totalt {currency(data.order.total)}</strong></div></section>
</main>
