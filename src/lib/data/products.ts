import {
	creativeCategories,
	creativeGalleryProducts,
	type CreativeCategory
} from '$lib/data/creative-gallery';
import type { Product } from '$lib/types/product';

/**
 * Shop-ready representation of the gallery catalogue. Keeping this as an
 * adapter means the gallery remains the single source of truth for products,
 * categories, prices, and image paths.
 */
export const products: Product[] = creativeGalleryProducts.map((product) => ({
	id: product.id,
	slug: product.id,
	name: product.title,
	shortDescription: product.description,
	description: product.description,
	price: product.price ?? 0,
	category: product.category,
	image: product.image,
	imageAlt: product.alt,
	imageWidth: product.imageWidth,
	imageHeight: product.imageHeight,
	featured: product.featured
}));

export const categories = ['Alla', ...creativeCategories] as const;
export type ShopCategory = 'Alla' | CreativeCategory;

export const getProduct = (slug: string) => products.find((product) => product.slug === slug);
