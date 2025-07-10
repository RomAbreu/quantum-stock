'use client';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { Icon } from '@iconify/react';
import { getAllCategories } from '@/lib/constants/categories.constants';
import type { Key } from 'react';

type FilterByCategoryProps = {
  defaultValue: string;
  onChange: (category: string) => void;
  categories?: never; // Ya no necesitamos este prop
};

export default function FilterByCategory({
  defaultValue,
  onChange,
}: Readonly<FilterByCategoryProps>) {
  const categories = getAllCategories();

  const handleSelectionChange = (key: Key | null) => {
    if (key) {
      const category = key.toString();
      onChange(category === 'ALL' ? 'all' : category);
    }
  };

  // Convert defaultValue to match our category format
  const selectedKey = defaultValue === 'all' ? 'ALL' : defaultValue;

  return (
    <Autocomplete
      size="sm"
      placeholder="Categoría"
      defaultItems={categories}
      selectedKey={selectedKey}
      onSelectionChange={handleSelectionChange}
      startContent={<Icon icon="lucide:filter" className="text-default-400" />}
      variant="bordered"
      className="min-w-[180px]"
      aria-label="Filtrar por categoría"
      allowsCustomValue={false}
    >
      {(category) => (
        <AutocompleteItem key={category.value} textValue={category.label}>
          {category.label}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}