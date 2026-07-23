import { fail, type Actions } from '@sveltejs/kit';
import { getOrder, orderUpdateSchema } from '$lib/server/orders';
import { getSupabaseAdmin } from '$lib/server/supabase';

export const load = async ({ params }) => ({ order: await getOrder(params.id) });

export const actions: Actions = {
	update: async ({ request, params }) => {
		const parsed = orderUpdateSchema.safeParse(Object.fromEntries(await request.formData()));
		if (!parsed.success) return fail(400, { message: 'Välj giltiga statusar.' });
		const { error } = await getSupabaseAdmin().from('orders').update({ payment_status: parsed.data.paymentStatus, order_status: parsed.data.orderStatus }).eq('id', params.id);
		if (error) return fail(500, { message: 'Kunde inte spara ändringen.' });
		return { success: true };
	}
};
