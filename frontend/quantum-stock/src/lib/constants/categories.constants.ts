export enum ProductCategory {
	ELECTRONICS = 'ELECTRONICS',
	CLOTHING = 'CLOTHING',
	HOME = 'HOME',
	HEALTH = 'HEALTH',
	TOYS = 'TOYS',
	SPORTS = 'SPORTS',
	BOOKS = 'BOOKS',
	FOOD = 'FOOD',
	PET_SUPPLIES = 'PET_SUPPLIES',
	AUTOMOTIVE = 'AUTOMOTIVE',
}

export const PRODUCT_CATEGORIES = Object.values(ProductCategory);

export const getCategoryKey = (displayName: string): string => {
	const entries = Object.entries(ProductCategory);
	const found = entries.find(([_, value]) => value === displayName);
	return found ? found[0] : displayName;
};

export const getCategoryDisplayName = (key: string): string => {
	return ProductCategory[key as keyof typeof ProductCategory] || key;
};
