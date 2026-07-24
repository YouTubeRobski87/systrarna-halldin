import { browser } from '$app/environment';
import { derived, writable } from 'svelte/store';
import { products } from '$lib/data/products';
import { bonusBeads, type BonusBead, type Product } from '$lib/types/product';

export type CartItem = { product: Product; quantity: number; bonusBead?: BonusBead };
const key = 'systrarna-halldin-cart';
const storedItems: CartItem[] = browser ? JSON.parse(localStorage.getItem(key) ?? '[]') : [];
const initial = storedItems.flatMap((item) => {
	const product = products.find((candidate) => candidate.id === item.product?.id);
	if (!product || (item.bonusBead !== undefined && !bonusBeads.includes(item.bonusBead))) return [];
	return [{ ...item, product }];
});
export const cart = writable<CartItem[]>(initial);
if (browser) cart.subscribe((items) => localStorage.setItem(key, JSON.stringify(items)));
export const cartCount = derived(cart, (items) =>
	items.reduce((sum, item) => sum + item.quantity, 0)
);
export const cartTotal = derived(cart, (items) =>
	items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
);
export function addToCart(product: Product, bonusBead?: BonusBead, quantity = 1) {
	const maxQuantity = 99;
	cart.update((items) => {
		const found = items.find(
			(item) => item.product.id === product.id && item.bonusBead === bonusBead
		);
		if (found)
			return items.map((item) =>
				item === found
					? { ...item, quantity: Math.min(item.quantity + quantity, maxQuantity) }
					: item
			);
		return [...items, { product, bonusBead, quantity: Math.min(quantity, maxQuantity) }];
	});
}
export function updateQuantity(id: string, quantity: number, bonusBead?: BonusBead) {
	cart.update((items) =>
		quantity < 1
			? items.filter((item) => !(item.product.id === id && item.bonusBead === bonusBead))
			: items.map((item) =>
					item.product.id === id && item.bonusBead === bonusBead
						? { ...item, quantity: Math.min(quantity, 99) }
						: item
				)
	);
}

export function updateBonusBead(
	id: string,
	currentBonusBead: BonusBead | undefined,
	bonusBead: BonusBead
) {
	if (currentBonusBead === bonusBead) return;

	cart.update((items) => {
		const currentItem = items.find(
			(item) => item.product.id === id && item.bonusBead === currentBonusBead
		);
		if (!currentItem) return items;

		const matchingItem = items.find(
			(item) => item.product.id === id && item.bonusBead === bonusBead
		);
		if (matchingItem) {
			return items
				.filter((item) => item !== currentItem)
				.map((item) =>
					item === matchingItem
						? { ...item, quantity: Math.min(item.quantity + currentItem.quantity, 99) }
						: item
				);
		}

		return items.map((item) => (item === currentItem ? { ...item, bonusBead } : item));
	});
}
export const clearCart = () => cart.set([]);
