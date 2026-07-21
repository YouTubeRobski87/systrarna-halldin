import { browser } from '$app/environment';
import { derived, writable } from 'svelte/store';
import type { Product } from '$lib/types/product';

export type CartItem = { product: Product; quantity: number; variation?: string };
const key = 'systrarna-halldin-cart';
const initial: CartItem[] = browser ? JSON.parse(localStorage.getItem(key) ?? '[]') : [];
export const cart = writable<CartItem[]>(initial);
if (browser) cart.subscribe((items) => localStorage.setItem(key, JSON.stringify(items)));
export const cartCount = derived(cart, (items) =>
	items.reduce((sum, item) => sum + item.quantity, 0)
);
export const cartTotal = derived(cart, (items) =>
	items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
);
export function addToCart(product: Product, variation?: string, quantity = 1) {
	const maxQuantity = product.stock ?? 99;
	cart.update((items) => {
		const found = items.find(
			(item) => item.product.id === product.id && item.variation === variation
		);
		if (found)
			return items.map((item) =>
				item === found
					? { ...item, quantity: Math.min(item.quantity + quantity, maxQuantity) }
					: item
			);
		return [...items, { product, variation, quantity: Math.min(quantity, maxQuantity) }];
	});
}
export function updateQuantity(id: string, quantity: number, variation?: string) {
	cart.update((items) =>
		quantity < 1
			? items.filter((item) => !(item.product.id === id && item.variation === variation))
			: items.map((item) =>
					item.product.id === id && item.variation === variation
						? { ...item, quantity: Math.min(quantity, item.product.stock ?? 99) }
						: item
				)
	);
}
export const clearCart = () => cart.set([]);
