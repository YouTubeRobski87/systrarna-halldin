export type Category = 'Armband' | 'Nyckelringar' | 'Squishies' | 'Övrigt';

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
	stock: number;
	featured: boolean;
	colors?: string[];
}
