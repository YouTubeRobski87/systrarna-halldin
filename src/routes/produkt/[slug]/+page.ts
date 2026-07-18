import { error } from '@sveltejs/kit';
import { getProduct } from '$lib/data/products';
export const load = ({ params }) => {
	const product = getProduct(params.slug);
	if (!product) error(404, 'Produkten hittades inte');
	return { product };
};
