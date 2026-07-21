import type { CartItem } from '$lib/stores/cart';

export const PENDING_PAYMENT_STATUS = 'Väntar på betalning' as const;

export type SubmittedOrder = {
	orderNumber: string;
	items: CartItem[];
	total: number;
	status: typeof PENDING_PAYMENT_STATUS;
};

export function createOrderNumber(now = new Date()) {
	const date = [
		now.getFullYear(),
		String(now.getMonth() + 1).padStart(2, '0'),
		String(now.getDate()).padStart(2, '0')
	].join('');
	const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
		.map((part) => String(part).padStart(2, '0'))
		.join('');
	const random = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).slice(-4).toUpperCase();

	return `SH-${date}-${time}-${random}`;
}
