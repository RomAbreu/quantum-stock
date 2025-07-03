export const categoryMap: Record<string, string> = {
	electronics: 'Electrónicos',
	clothing: 'Ropa',
	home: 'Hogar',
	health: 'Salud',
	toys: 'Juguetes',
	sports: 'Deportes',
	books: 'Libros',
	food: 'Alimentos',
	pet_supplies: 'Suministros para mascotas',
	automotive: 'Automotriz',
};

export function formatCategory(category: string): string {
	const lowerCategory = category.toLowerCase();
	for (const [key, value] of Object.entries(categoryMap)) {
		if (key.toLowerCase() === lowerCategory) {
			return value;
		}
	}

	return category.charAt(0).toUpperCase() + category.slice(1);
}
