export const creativeCategories = [
	'Armband',
	'Klistermärken',
	'Nyckelringar',
	'Övrigt',
	'Pappers-squishies',
	'Pärlplattor',
	'Suddgummi'
] as const;

export type CreativeCategory = (typeof creativeCategories)[number];
export type GalleryCreator = 'Alma' | 'Emilia' | 'Alma och Emilia' | null;
export type GalleryStatus = 'available' | 'reserved' | 'sold' | 'not-for-sale';

export type GalleryProduct = {
	id: string;
	title: string;
	category: CreativeCategory;
	description: string;
	price: number | null;
	creator: GalleryCreator;
	status: GalleryStatus;
	featured: boolean;
	image: string;
	alt: string;
	imageWidth: number;
	imageHeight: number;
};

type GallerySource = {
	category: CreativeCategory;
	folder: string;
	idPrefix: string;
	titlePrefix: string;
	files: string[];
};

const gallerySources: GallerySource[] = [
	{
		category: 'Armband',
		folder: 'armband',
		idPrefix: 'armband',
		titlePrefix: 'Armband',
		files: [
			'cerise-parlarmband-01.jpg',
			'lila-hjartarmband-01.jpg',
			'lila-parlarmband-01.jpg',
			'regnbagsarmband-01.jpg',
			'rosa-parlarmband-01.jpg',
			'solsken-armband-01.jpg'
		]
	},
	{
		category: 'Klistermärken',
		folder: 'klistermärken',
		idPrefix: 'klistermarke',
		titlePrefix: 'Klistermärke',
		files: [
			'8064356331.jpg',
			'8064357111.jpg',
			'8064357221(1).jpg',
			'8064357321(1).jpg',
			'8064357461.jpg',
			'8064357571(1).jpg',
			'8064357671(1).jpg',
			'8064357761(1).jpg',
			'8064357851.jpg',
			'8064358161(1).jpg'
		]
	},
	{
		category: 'Nyckelringar',
		folder: 'nyckelringar',
		idPrefix: 'nyckelring',
		titlePrefix: 'Nyckelring',
		files: [
			'bi-nyckelring-01.jpg',
			'bla-parl-nyckelring-01.jpg',
			'gron-parl-nyckelring-01.jpg',
			'lila-mane-nyckelring-01.jpg',
			'lila-parl-nyckelring-01.jpg',
			'orange-parl-nyckelring-01.jpg',
			'regnbage-nyckelring-01.jpg',
			'regnbage-parl-nyckelring-01.jpg',
			'rod-mane-nyckelring-01.jpg',
			'rosa-parl-nyckelring-01.jpg',
			'rosa-parl-nyckelring-02.jpg'
		]
	},
	{
		category: 'Övrigt',
		folder: 'ovrigt',
		idPrefix: 'ovrigt',
		titlePrefix: 'Övrigt',
		files: [
			'8063351171.jpg',
			'8064160991.jpg',
			'8064161841.jpg',
			'8064163121.jpg',
			'8064163651.jpg',
			'8064164571.jpg',
			'8064357221.jpg',
			'8064357321.jpg',
			'8064357571.jpg',
			'8064357671.jpg',
			'8064357761.jpg',
			'8064357851(1).jpg',
			'8064358161.jpg'
		]
	},
	{
		category: 'Pappers-squishies',
		folder: 'Pappers-squishies',
		idPrefix: 'pappers-squishy',
		titlePrefix: 'Pappers-squishy',
		files: ['pappers-squishy-01.jpg', 'pappers-squishy-02.jpg', 'pappers-squishy-03.jpg']
	},
	{
		category: 'Pärlplattor',
		folder: 'Pärlplattor',
		idPrefix: 'parlplatta',
		titlePrefix: 'Pärlplatta',
		files: [
			'parlplatta-01.jpg',
			'parlplatta-02.jpg',
			'parlplatta-03.jpg',
			'parlplatta-04.jpg',
			'parlplatta-05.jpg',
			'parlplatta-06.jpg',
			'parlplatta-07.jpg',
			'parlplatta-08.jpg',
			'parlplatta-09.jpg'
		]
	},
	{
		category: 'Suddgummi',
		folder: 'suddigummi',
		idPrefix: 'suddgummi',
		titlePrefix: 'Suddgummi',
		files: [
			'suddgummi-01.jpg',
			'suddgummi-02.jpg',
			'suddgummi-03.jpg',
			'suddgummi-04.jpg',
			'suddgummi-05.jpg',
			'suddgummi-06.jpg',
			'suddgummi-07.jpg',
			'suddgummi-08.jpg',
			'suddgummi-09.jpg',
			'suddgummi-10.jpg',
			'suddgummi-11.jpg',
			'suddgummi-12.jpg',
			'suddgummi-13.jpg',
			'suddgummi-14.jpg',
			'suddgummi-15.jpg',
			'suddgummi-16.jpg'
		]
	}
];

const createImagePath = (folder: string, fileName: string) =>
	encodeURI(`/images/produkter/original/${folder}/${fileName}`);

export const creativeGalleryProducts: GalleryProduct[] = gallerySources.flatMap((source) =>
	source.files.map((fileName, index) => {
		const number = String(index + 1).padStart(2, '0');
		const title = `${source.titlePrefix} ${number}`;

		return {
			id: `${source.idPrefix}-${number}`,
			title,
			category: source.category,
			description: 'Handgjord skapelse av Alma och Emilia.',
			price: null,
			creator: null,
			status: 'available',
			featured: false,
			image: createImagePath(source.folder, fileName),
			alt: `${title} – handgjord skapelse av Alma och Emilia`,
			imageWidth: 1536,
			imageHeight: 2048
		};
	})
);
