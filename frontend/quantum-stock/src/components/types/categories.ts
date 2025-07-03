export enum Category {
  ALL = 'all',
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  BOOKS = 'books',
  HOME = 'home',
  SPORTS = 'sports',
  BEAUTY = 'beauty',
  AUTOMOTIVE = 'automotive',
  TOYS = 'toys',
  FOOD = 'food',
  HEALTH = 'health',
}

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.ALL]: 'Todas las categorías',
  [Category.ELECTRONICS]: 'Electrónicos',
  [Category.CLOTHING]: 'Ropa y Accesorios',
  [Category.BOOKS]: 'Libros',
  [Category.HOME]: 'Hogar y Jardín',
  [Category.SPORTS]: 'Deportes',
  [Category.BEAUTY]: 'Belleza y Cuidado Personal',
  [Category.AUTOMOTIVE]: 'Automotriz',
  [Category.TOYS]: 'Juguetes',
  [Category.FOOD]: 'Alimentos y Bebidas',
  [Category.HEALTH]: 'Salud y Bienestar',
};

// Utility function to get all categories as array
export const getAllCategories = () => {
  return Object.values(Category).map(category => ({
    value: category,
    label: CATEGORY_LABELS[category],
  }));
};

// Filter categories (exclude ALL for some use cases)
export const getCategoriesWithoutAll = () => {
  return Object.values(Category)
    .filter(category => category !== Category.ALL)
    .map(category => ({
      value: category,
      label: CATEGORY_LABELS[category],
    }));
};

// Check if a string is a valid category
export const isValidCategory = (value: string): value is Category => {
  return Object.values(Category).includes(value as Category);
};

// Get category label by value
export const getCategoryLabel = (category: Category): string => {
  return CATEGORY_LABELS[category];
};