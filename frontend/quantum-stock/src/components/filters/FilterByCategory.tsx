'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import type { Key } from 'react';
import { Category, getAllCategories, isValidCategory } from '@components/types/categories';

type FilterByCategoryProps = {
  label?: string;
  defaultValue?: Category;
  includeAllOption?: boolean;
};

export default function FilterByCategory({
  label = 'Categoría',
  defaultValue = Category.ALL,
  includeAllOption = true,
}: Readonly<FilterByCategoryProps>) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [selectedCategory, setSelectedCategory] = useState<Key | null>(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && isValidCategory(categoryFromUrl)) {
      return categoryFromUrl;
    }
    return defaultValue;
  });

  // Get all categories or filter out ALL option based on prop
  const categories = getAllCategories().filter(category => 
    includeAllOption || category.value !== Category.ALL
  );

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && isValidCategory(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory(defaultValue);
    }
  }, [searchParams, defaultValue]);

  const handleCategoryChange = (key: Key | null) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = key?.toString() ?? '';
    
    // Only set URL param if it's not ALL and it's a valid category
    if (value && value !== Category.ALL && isValidCategory(value)) {
      params.set('category', value);
    } else {
      params.delete('category');
    }

    setSelectedCategory(key);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="category-filter" className="text-sm font-medium text-default-700">
        {label}
      </label>
      <Autocomplete
        id="category-filter"
        defaultItems={categories}
        selectedKey={selectedCategory}
        onSelectionChange={handleCategoryChange}
        size="sm"
        variant="bordered"
        className="w-56 min-w-56"
        aria-label="Filter by category"
        startContent={<Icon icon="lucide:tag" className="text-default-400" />}
        placeholder="Selecciona categoría"
      >
        {(category) => (
          <AutocompleteItem key={category.value} textValue={category.label}>
            {category.label}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
}