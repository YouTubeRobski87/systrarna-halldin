import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { products } from '$lib/data/products';
import {
	orderStatuses,
	paymentStatuses,
	type OrderStatus,
	type PaymentStatus
} from '$lib/order-status';
import { getSupabaseAdmin } from '$lib/server/supabase';

export { orderStatuses, paymentStatuses, type OrderStatus, type PaymentStatus };

const checkoutSchema = z.object({
	customerName: z.string().trim().min(2).max(120),
	customerEmail: z.string().trim().email().max(254),
	customerPhone: z.string().trim().min(5).max(30),
	address: z.string().trim().min(3).max(200),
	postalCode: z
		.string()
		.trim()
		.regex(/^[0-9 ]{5,10}$/),
	city: z.string().trim().min(2).max(100),
	customerMessage: z.string().trim().max(1000),
	items: z
		.array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(99) }))
		.min(1)
		.max(99)
});

export const orderUpdateSchema = z.object({
	paymentStatus: z.enum(paymentStatuses),
	orderStatus: z.enum(orderStatuses)
});

export type OrderItem = {
	productId: string;
	name: string;
	quantity: number;
	price: number;
	image: string;
	creator: string | null;
};

export type OrderRecord = {
	id: string;
	order_number: string;
	created_at: string;
	updated_at: string;
	customer_name: string;
	customer_email: string;
	customer_phone: string;
	address: string;
	postal_code: string;
	city: string;
	items: OrderItem[];
	subtotal: number;
	shipping_cost: number;
	total: number;
	payment_method: 'swish';
	payment_status: PaymentStatus;
	order_status: OrderStatus;
	customer_message: string;
};

function newOrderNumber() {
	const date = new Date().toISOString().slice(2, 10).replaceAll('-', '');
	const suffix = crypto.randomUUID().slice(0, 5).toUpperCase();
	return `SH-${date}-${suffix}`;
}

export async function createOrder(input: unknown) {
	const parsed = checkoutSchema.safeParse(input);
	if (!parsed.success)
		return {
			success: false as const,
			message: 'Kontrollera att alla uppgifter är korrekt ifyllda.'
		};

	const items: OrderItem[] = [];
	for (const item of parsed.data.items) {
		const product = products.find((candidate) => candidate.id === item.productId);
		if (!product)
			return {
				success: false as const,
				message: 'En produkt i varukorgen finns inte längre kvar.'
			};
		items.push({
			productId: product.id,
			name: product.name,
			quantity: item.quantity,
			price: product.price,
			image: product.image,
			creator: product.madeBy ?? null
		});
	}

	const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	const shippingCost = 0;
	const order = {
		order_number: newOrderNumber(),
		customer_name: parsed.data.customerName,
		customer_email: parsed.data.customerEmail,
		customer_phone: parsed.data.customerPhone,
		address: parsed.data.address,
		postal_code: parsed.data.postalCode,
		city: parsed.data.city,
		items,
		subtotal,
		shipping_cost: shippingCost,
		total: subtotal + shippingCost,
		payment_method: 'swish' as const,
		payment_status: 'pending' as const,
		order_status: 'new' as const,
		customer_message: parsed.data.customerMessage
	};

	const { data, error: databaseError } = await getSupabaseAdmin()
		.from('orders')
		.insert(order)
		.select('id, order_number, total, payment_status, order_status')
		.single();
	if (databaseError || !data)
		return { success: false as const, message: 'Kunde inte spara beställningen. Försök igen.' };

	return { success: true as const, order: data };
}

export async function getOrder(id: string) {
	const { data, error: databaseError } = await getSupabaseAdmin()
		.from('orders')
		.select('*')
		.eq('id', id)
		.single();
	if (databaseError || !data) error(404, 'Ordern hittades inte');
	return data as OrderRecord;
}
