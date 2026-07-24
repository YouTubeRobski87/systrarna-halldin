import { env } from '$env/dynamic/private';
import { SWISH_NUMBER } from '$lib/config/payment';
import {
	orderStatusLabels,
	paymentStatusLabels,
	type OrderStatus,
	type PaymentStatus
} from '$lib/order-status';
import type { OrderRecord } from '$lib/server/orders';

const from = () => env.ORDER_EMAIL_FROM || 'Systrarna Halldin <butik@systrarnahalldin.se>';
const replyTo = () => env.ORDER_REPLY_TO || 'butik@systrarnahalldin.se';

function escapeHtml(value: string) {
	return value.replace(/[&<>'"]/g, (character) => {
		const entities: Record<string, string> = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			"'": '&#39;',
			'"': '&quot;'
		};
		return entities[character];
	});
}

function formatCurrency(value: number) {
	return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(value);
}

async function sendEmail({
	to,
	subject,
	html,
	text,
	idempotencyKey
}: {
	to: string;
	subject: string;
	html: string;
	text: string;
	idempotencyKey: string;
}) {
	if (!env.RESEND_API_KEY) return false;

	try {
		const response = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${env.RESEND_API_KEY}`,
				'Content-Type': 'application/json',
				'User-Agent': 'systrarna-halldin/1.0',
				'Idempotency-Key': idempotencyKey
			},
			body: JSON.stringify({ from: from(), to: [to], reply_to: replyTo(), subject, html, text })
		});
		return response.ok;
	} catch {
		return false;
	}
}

export async function sendOrderConfirmation(order: OrderRecord) {
	const items = order.items
		.map(
			(item) =>
				`<li>${escapeHtml(item.name)} – ${item.quantity} × ${formatCurrency(item.price)}</li>`
		)
		.join('');
	const textItems = order.items
		.map((item) => `- ${item.name}: ${item.quantity} × ${formatCurrency(item.price)}`)
		.join('\n');
	const subject = `Vi har tagit emot din beställning ${order.order_number}`;
	return sendEmail({
		to: order.customer_email,
		subject,
		idempotencyKey: `order-confirmation-${order.id}`,
		html: `<h1>Tack för din beställning, ${escapeHtml(order.customer_name)}!</h1>
<p>Din beställning <strong>${escapeHtml(order.order_number)}</strong> har tagits emot.</p>
<h2>Betalning med Swish</h2>
<p>Swisha <strong>${formatCurrency(order.total)}</strong> till <strong>${escapeHtml(SWISH_NUMBER)}</strong> och skriv <strong>${escapeHtml(order.order_number)}</strong> som meddelande.</p>
<p>Beställningen är inte betald förrän betalningen har mottagits och matchats mot ordernumret.</p>
<h2>Din beställning</h2><ul>${items}</ul>
<p>Delsumma: ${formatCurrency(order.subtotal)}<br />Frakt: ${order.shipping_cost === 0 ? 'Gratis' : formatCurrency(order.shipping_cost)}<br /><strong>Totalt: ${formatCurrency(order.total)}</strong></p>
<p>Har du frågor? Svara på detta mejl så hjälper vi dig.</p>`,
		text: `Tack för din beställning, ${order.customer_name}!\n\nOrdernummer: ${order.order_number}\n\nSwisha ${formatCurrency(order.total)} till ${SWISH_NUMBER} och skriv ${order.order_number} som meddelande.\n\nDin beställning:\n${textItems}\n\nDelsumma: ${formatCurrency(order.subtotal)}\nFrakt: ${order.shipping_cost === 0 ? 'Gratis' : formatCurrency(order.shipping_cost)}\nTotalt: ${formatCurrency(order.total)}\n\nHar du frågor? Svara på detta mejl så hjälper vi dig.`
	});
}

export async function sendOrderStatusUpdate(
	order: OrderRecord,
	previous: { paymentStatus: PaymentStatus; orderStatus: OrderStatus }
) {
	const paymentChanged = previous.paymentStatus !== order.payment_status;
	const orderChanged = previous.orderStatus !== order.order_status;
	if (!paymentChanged && !orderChanged) return false;

	const changeLines = [
		paymentChanged ? `Betalstatus: ${paymentStatusLabels[order.payment_status]}` : null,
		orderChanged ? `Orderstatus: ${orderStatusLabels[order.order_status]}` : null
	].filter((change): change is string => Boolean(change));
	const updateId = order.updated_at.replace(/[^a-zA-Z0-9_-]/g, '');

	return sendEmail({
		to: order.customer_email,
		subject: `Uppdatering om din beställning ${order.order_number}`,
		idempotencyKey: `order-status-${order.id}-${updateId}`,
		html: `<h1>Uppdatering om din beställning</h1><p>Hej ${escapeHtml(order.customer_name)}!</p><p>Din beställning <strong>${escapeHtml(order.order_number)}</strong> har uppdaterats.</p><p>${changeLines.join('<br />')}</p><p>Har du frågor? Svara på detta mejl så hjälper vi dig.</p>`,
		text: `Hej ${order.customer_name}!\n\nDin beställning ${order.order_number} har uppdaterats.\n\n${changeLines.join('\n')}\n\nHar du frågor? Svara på detta mejl så hjälper vi dig.`
	});
}
