// lib/constants/categories.constants.ts
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

// Labels para mostrar en la UI
export const CATEGORY_LABELS: Record<ProductCategory | 'ALL', string> = {
  'ALL': 'Todas las categorías',
  [ProductCategory.ELECTRONICS]: 'Electrónicos',
  [ProductCategory.CLOTHING]: 'Ropa y Accesorios',
  [ProductCategory.BOOKS]: 'Libros',
  [ProductCategory.HOME]: 'Hogar y Jardín',
  [ProductCategory.SPORTS]: 'Deportes',
  [ProductCategory.HEALTH]: 'Salud y Bienestar',
  [ProductCategory.AUTOMOTIVE]: 'Automotriz',
  [ProductCategory.TOYS]: 'Juguetes',
  [ProductCategory.FOOD]: 'Alimentos y Bebidas',
  [ProductCategory.PET_SUPPLIES]: 'Mascotas',
};

// Array de todas las categorías
export const PRODUCT_CATEGORIES = Object.values(ProductCategory);

// Utility functions
export const getAllCategories = () => {
  return [
    { value: 'ALL', label: CATEGORY_LABELS['ALL'] },
    ...Object.values(ProductCategory).map(category => ({
      value: category,
      label: CATEGORY_LABELS[category] || category,
    }))
  ];
};

export const getCategoriesWithoutAll = () => {
  return Object.values(ProductCategory).map(category => ({
    value: category,
    label: CATEGORY_LABELS[category] || category,
  }));
};

export const isValidCategory = (value: string): value is ProductCategory => {
  return Object.values(ProductCategory).includes(value as ProductCategory);
};

export const getCategoryLabel = (category: ProductCategory | 'ALL'): string => {
  return CATEGORY_LABELS[category] || category;
};

// Funciones de compatibilidad (mantienen la API anterior)
export const getCategoryKey = (displayName: string): string => {
  const entries = Object.entries(ProductCategory);
  const found = entries.find(([_, value]) => value === displayName);
  return found ? found[0] : displayName;
};

export const getCategoryDisplayName = (key: string): string => {
  return ProductCategory[key as keyof typeof ProductCategory] || key;
};