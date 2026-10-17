import {
	getSupabaseAdmin,
	isSupabaseConnectionError,
	logSupabaseQueryError,
	logSupabaseUnavailable,
	SupabaseConfigurationError
} from '$lib/server/supabase';
import { orderStatuses, paymentStatuses, type OrderRecord } from '$lib/server/orders';

type DatabaseState = 'ready' | 'configuration-error' | 'connection-error' | 'query-error';

export const load = async ({ url }) => {
	const paymentStatus = url.searchParams.get('paymentStatus');
	const orderStatus = url.searchParams.get('orderStatus');
	const search = url.searchParams.get('q')?.trim().toLocaleLowerCase('sv-SE') ?? '';
	let data: OrderRecord[] | null = null;
	let databaseError: string | null = null;
	let databaseState: DatabaseState = 'ready';
	try {
		const result = await getSupabaseAdmin()
			.from('orders')
			.select('*')
			.order('created_at', { ascending: false });
		if (result.error) {
			logSupabaseQueryError('[admin orders] Failed to read public.orders:', result.error);
			if (isSupabaseConnectionError(result.error)) {
				databaseState = 'connection-error';
				databaseError = 'Orderdatabasen kan inte nås just nu. Försök igen senare.';
			} else {
				databaseState = 'query-error';
				databaseError = 'Orderhämtningen misslyckades. Felet är loggat på servern.';
			}
		} else {
			data = result.data as OrderRecord[];
		}
	} catch (error) {
		logSupabaseUnavailable('[admin orders] Supabase is unavailable:', error);
		if (error instanceof SupabaseConfigurationError) {
			databaseState = 'configuration-error';
			databaseError = error.message;
		} else {
			databaseState = 'connection-error';
			databaseError = 'Orderdatabasen kan inte nås just nu. Försök igen senare.';
		}
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
		databaseState,
		paymentStatuses,
		orderStatuses,
		filters: { paymentStatus: paymentStatus ?? 'all', orderStatus: orderStatus ?? 'all', search }
	};
};
