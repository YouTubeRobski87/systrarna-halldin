export type Category = 'Armband' | 'Nyckelringar';
export type MadeBy = 'Alma' | 'Emilia';

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
