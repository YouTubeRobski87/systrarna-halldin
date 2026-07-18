import type { Product } from '$lib/types/product';

export const products: Product[] = [
	{
		id: 'rainbow-bracelet',
		slug: 'regnbagsarmband',
		name: 'Regnbågsarmband',
		shortDescription: 'Färgglada pärlor för varje dag.',
		description:
			'Ett glatt handgjort armband med pärlor i mjuka regnbågsfärger. Varje armband blir lite unikt.',
		price: 79,
		category: 'Armband',
		image: '🌈',
		imageAlt: 'Regnbågsfärgat pärlarmband',
		stock: 6,
		featured: true,
		colors: ['Regnbåge', 'Pastell']
	},
	{
		id: 'lavender-bracelet',
		slug: 'lavendelarmband',
		name: 'Lavendelarmband',
		shortDescription: 'Lila toner med en liten blomma.',
		description:
			'Ett fint pärlarmband i lavendel, syren och mjuk vit. Skapat för att passa lika bra ensamt som tillsammans med andra armband.',
		price: 75,
		category: 'Armband',
		image: '💜',
		imageAlt: 'Lavendelfärgat armband',
		stock: 4,
		featured: true,
		colors: ['Lavendel', 'Vit']
	},
	{
		id: 'heart-bracelet',
		slug: 'rosa-hjartarmband',
		name: 'Rosa hjärtarmband',
		shortDescription: 'Ett litet hjärta att bära med sig.',
		description: 'Handgjort armband med rosa pärlor och ett glittrande hjärta i mitten.',
		price: 85,
		category: 'Armband',
		image: '💗',
		imageAlt: 'Rosa hjärtarmband',
		stock: 8,
		featured: false,
		colors: ['Rosa', 'Pärlemor']
	},
	{
		id: 'bead-keyring',
		slug: 'nyckelring-med-parlor',
		name: 'Nyckelring med pärlor',
		shortDescription: 'Gör nycklarna lättare att hitta.',
		description: 'En pigg pärlnyckelring med stadig ring. Perfekt på nyckelknippan eller väskan.',
		price: 69,
		category: 'Nyckelringar',
		image: '🫧',
		imageAlt: 'Nyckelring med färgade pärlor',
		stock: 5,
		featured: true,
		colors: ['Mint', 'Rosa', 'Lavendel']
	},
	{
		id: 'star-keyring',
		slug: 'stjarnnyckelring',
		name: 'Stjärnnyckelring',
		shortDescription: 'En liten stjärna på språng.',
		description: 'Handgjord nyckelring med en mjuk stjärndekoration och små matchande pärlor.',
		price: 65,
		category: 'Nyckelringar',
		image: '⭐',
		imageAlt: 'Stjärnformad nyckelring',
		stock: 3,
		featured: false,
		colors: ['Gul', 'Lila']
	},
	{
		id: 'panda-squishy',
		slug: 'panda-squishy',
		name: 'Panda-squishy',
		shortDescription: 'Mjuk, söt och skön att klämma på.',
		description:
			'En liten panda-squishy med vänligt ansikte. Alla squishies väljs ut och packas med omsorg.',
		price: 99,
		category: 'Squishies',
		image: '🐼',
		imageAlt: 'Panda squishy',
		stock: 7,
		featured: true
	},
	{
		id: 'strawberry-squishy',
		slug: 'jordgubbs-squishy',
		name: 'Jordgubbs-squishy',
		shortDescription: 'Somrig favorit i miniformat.',
		description:
			'En mjuk jordgubbssquishy med härlig känsla. Fin som present eller liten vardagsglädje.',
		price: 89,
		category: 'Squishies',
		image: '🍓',
		imageAlt: 'Jordgubbs squishy',
		stock: 2,
		featured: false
	},
	{
		id: 'surprise-bag',
		slug: 'overraskningspase',
		name: 'Överraskningspåse',
		shortDescription: 'En blandning av små favoriter.',
		description: 'En omsorgsfullt utvald påse med minst tre små överraskningar från vår verkstad.',
		price: 119,
		category: 'Övrigt',
		image: '🎁',
		imageAlt: 'Presentpåse med överraskningar',
		stock: 10,
		featured: true
	}
];

export const categories = ['Alla', 'Armband', 'Nyckelringar', 'Squishies', 'Övrigt'] as const;
export const getProduct = (slug: string) => products.find((product) => product.slug === slug);
