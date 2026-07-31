import { fail, type Actions } from '@sveltejs/kit';
import { sendOrderStatusUpdate } from '$lib/server/order-email';
import { getOrder, orderUpdateSchema } from '$lib/server/orders';
import { getSupabaseAdmin } from '$lib/server/supabase';

export const load = async ({ params }) => ({ order: await getOrder(params.id) });

export const actions: Actions = {
	update: async ({ request, params }) => {
		const parsed = orderUpdateSchema.safeParse(Object.fromEntries(await request.formData()));
		if (!parsed.success) return fail(400, { message: 'Välj giltiga statusar.' });
		if (!params.id) return fail(400, { message: 'Ordern saknar id.' });
		try {
			const previousOrder = await getOrder(params.id);
			const { data, error } = await getSupabaseAdmin()
				.from('orders')
				.update({
					payment_status: parsed.data.paymentStatus,
					order_status: parsed.data.orderStatus
				})
				.eq('id', params.id)
				.select('*')
				.single();
			if (error || !data) {
				console.error('[admin order] Failed to update public.orders:', {
					code: error?.code,
					message: error?.message
				});
				return fail(503, {
					message: 'Kunde inte spara ändringen. Kontrollera Supabase och försök igen.'
				});
			}
			await sendOrderStatusUpdate(data, {
				paymentStatus: previousOrder.payment_status,
				orderStatus: previousOrder.order_status
			});
			return { success: true };
		} catch (error) {
			console.error('[admin order] Update failed because Supabase is unavailable:', error);
			return fail(503, { message: 'Orderdatabasen kan inte nås just nu. Försök igen senare.' });
		}
	}
};
