import type { CreativeCategory } from '$lib/data/creative-gallery';

export type Category = CreativeCategory;
export type MadeBy = 'Alma' | 'Emilia';
export const bonusBeads = [
	'Överraska mig',
	'Rosa',
	'Lila',
	'Blå',
	'Grön',
	'Gul',
	'Orange',
	'Röd',
	'Regnbåge'
] as const;
export type BonusBead = (typeof bonusBeads)[number];
export const hasBonusBeadOffer = (category: Category) =>
	category === 'Armband' || category === 'Nyckelringar';

export interface Product {
	id: string;
	slug: string;
	name: string;
	shortDescription: string;
	description: string;
	price: number;
	category: Category;
	image: string;
	imageAlt: string;
	imageWidth: number;
	imageHeight: number;
	featured: boolean;
	madeBy?: MadeBy;
}
