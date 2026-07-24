export const FREE_SHIPPING_THRESHOLD = 350;
export const STANDARD_SHIPPING_COST = 35;

export const getShippingCost = (subtotal: number) =>
	subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
