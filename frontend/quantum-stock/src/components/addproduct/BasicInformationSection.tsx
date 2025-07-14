'use client';
import { Input, Autocomplete, AutocompleteItem, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react';
import { NewProductData } from '@components/forms/types/product.types'
import { 
  getCategoriesWithoutAll, 
  isValidCategory 
} 

from '@/lib/constants/categories.constants';
import type { Key } from 'react';

type BasicInformationSectionProps = {
  formData: NewProductData;
  errors: Partial<Record<keyof NewProductData, string>>;
  updateField: (field: keyof NewProductData, value: string | number) => void;
  isDisabled: boolean;
};

export default function BasicInformationSection({
  formData,
  errors,
  updateField,
  isDisabled,
}: Readonly<BasicInformationSectionProps>) {
  // Get categories without "ALL" option since we're creating a product
  const categories = getCategoriesWithoutAll();

  const handleCategoryChange = (key: Key | null) => {
    const selectedCategory = key?.toString() ?? '';
   
    // Validate that the selected category is valid
    if (selectedCategory && isValidCategory(selectedCategory)) {
      updateField('category', selectedCategory);
    } else {
      updateField('category', '');
    }
  };

  // Ensure the selected category is valid for the Autocomplete
  const selectedCategoryKey = formData.category && isValidCategory(formData.category)
    ? formData.category
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon icon="lucide:info" className="text-primary" />
        <h3 className="font-semibold">Información Básica</h3>
      </div>

      <Input
        name="name"
        label="Nombre del Producto"
        placeholder="Ej: Laptop Dell XPS 13"
        value={formData.name}
        onValueChange={(value) => updateField('name', value)}
        isInvalid={!!errors.name}
        errorMessage={errors.name}
        startContent={<Icon icon="lucide:tag" className="text-default-400" />}
        variant="bordered"
        isRequired
        isDisabled={isDisabled}
      />

      <Textarea
        name="description"
        label="Descripción"
        placeholder="Describe las características principales del producto..."
        value={formData.description}
        onValueChange={(value) => updateField('description', value)}
        isInvalid={!!errors.description}
        errorMessage={errors.description}
        variant="bordered"
        minRows={3}
        isRequired
        isDisabled={isDisabled}
      />

      <Autocomplete
        name="category"
        label="Categoría"
        placeholder="Selecciona una categoría"
        defaultItems={categories}
        selectedKey={selectedCategoryKey}
        onSelectionChange={handleCategoryChange}
        isInvalid={!!errors.category}
        errorMessage={errors.category}
        variant="bordered"
        startContent={
          <Icon icon="lucide:folder" className="text-default-400" />
        }
        isRequired
        isDisabled={isDisabled}
        allowsCustomValue={false}
        aria-label="Selecciona categoría del producto"
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