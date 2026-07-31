import { getSupabaseAdmin, SupabaseConfigurationError } from '$lib/server/supabase';
import { orderStatuses, paymentStatuses, type OrderRecord } from '$lib/server/orders';

export const load = async ({ url }) => {
	const paymentStatus = url.searchParams.get('paymentStatus');
	const orderStatus = url.searchParams.get('orderStatus');
	const search = url.searchParams.get('q')?.trim().toLocaleLowerCase('sv-SE') ?? '';
	let data: OrderRecord[] | null = null;
	let databaseError: string | null = null;
	try {
		const result = await getSupabaseAdmin()
			.from('orders')
			.select('*')
			.order('created_at', { ascending: false });
		if (result.error) {
			console.error('[admin orders] Failed to read public.orders:', {
				code: result.error.code,
				message: result.error.message
			});
			databaseError =
				'Kunde inte läsa orderlistan. Kontrollera Supabase-anslutningen och att tabellen orders har skapats.';
		} else {
			data = result.data as OrderRecord[];
		}
	} catch (error) {
		console.error('[admin orders] Supabase is unavailable:', error);
		databaseError =
			error instanceof SupabaseConfigurationError
				? error.message
				: 'Orderdatabasen kan inte nås just nu. Försök igen senare.';
	}
	const orders = (data ?? []).filter((order) => {
		const matchesPayment =
			!paymentStatus || paymentStatus === 'all' || order.payment_status === paymentStatus;
		const matchesOrder =
			!orderStatus || orderStatus === 'all' || order.order_status === orderStatus;
		const haystack = [
			order.order_number,
			order.customer_name,
			order.customer_email,
			order.customer_phone
		]
			.join(' ')
			.toLocaleLowerCase('sv-SE');
		return matchesPayment && matchesOrder && (!search || haystack.includes(search));
	});
	return {
		orders,
		databaseError,
		paymentStatuses,
		orderStatuses,
		filters: { paymentStatus: paymentStatus ?? 'all', orderStatus: orderStatus ?? 'all', search }
	};
};
