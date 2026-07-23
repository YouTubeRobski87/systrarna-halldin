import { getSupabaseAdmin } from '$lib/server/supabase';
import { orderStatuses, paymentStatuses, type OrderRecord } from '$lib/server/orders';

export const load = async ({ url }) => {
	const paymentStatus = url.searchParams.get('paymentStatus');
	const orderStatus = url.searchParams.get('orderStatus');
	const search = url.searchParams.get('q')?.trim().toLocaleLowerCase('sv-SE') ?? '';
	const { data, error } = await getSupabaseAdmin()
		.from('orders')
		.select('*')
		.order('created_at', { ascending: false });
	if (error) throw new Error('Kunde inte läsa orderlistan.');
	const orders = (data as OrderRecord[]).filter((order) => {
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
		paymentStatuses,
		orderStatuses,
		filters: { paymentStatus: paymentStatus ?? 'all', orderStatus: orderStatus ?? 'all', search }
	};
};
