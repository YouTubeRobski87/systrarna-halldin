export const currency = (amount: number) =>
	new Intl.NumberFormat('sv-SE', {
		style: 'currency',
		currency: 'SEK',
		maximumFractionDigits: 0
	}).format(amount);
