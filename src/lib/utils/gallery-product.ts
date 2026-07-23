import type { GalleryProduct, GalleryStatus } from '$lib/data/creative-gallery';

const statusLabels: Record<GalleryStatus, string> = {
	available: 'Tillgänglig',
	reserved: 'Reserverad',
	sold: 'Såld',
	'not-for-sale': 'Endast visning'
};

export const getGalleryStatusLabel = (status: GalleryStatus) => statusLabels[status];

export const canExpressInterest = (status: GalleryStatus) =>
	status !== 'sold' && status !== 'not-for-sale';

export const sortFeaturedFirst = (products: GalleryProduct[]) =>
	[...products].sort((first, second) => Number(second.featured) - Number(first.featured));
