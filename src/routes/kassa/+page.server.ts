import { fail, type Actions } from '@sveltejs/kit';
import { sendOrderConfirmation } from '$lib/server/order-email';
import { createOrder } from '$lib/server/orders';

export const actions: Actions = {
	createOrder: async ({ request }) => {
		const formData = await request.formData();
		let items: unknown;
		try {
			items = JSON.parse(String(formData.get('items') ?? '[]'));
		} catch {
			return fail(400, { message: 'Varukorgen kunde inte läsas. Försök igen.' });
		}
		const result = await createOrder({
			customerName: formData.get('name'),
			customerEmail: formData.get('email'),
			customerPhone: formData.get('phone'),
			address: formData.get('address'),
			postalCode: formData.get('postal'),
			city: formData.get('city'),
			customerMessage: formData.get('comment') ?? '',
			items
		});
		if (!result.success) return fail(400, { message: result.message });
		await sendOrderConfirmation(result.order);
		return { order: result.order };
	}
};
