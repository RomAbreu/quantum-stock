'use client';

import { PRODUCT_CATEGORIES } from '@/lib/constants/categories.constants';
import { formatCategory } from '@/lib/utils/category.utils';
import type { NewProductData } from '@components/forms/types/product.types';
import { Input, Select, SelectItem, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react';

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

			<Select
				name="category"
				label="Categoría"
				placeholder="Selecciona una categoría"
				selectedKeys={formData.category ? [formData.category] : []}
				onSelectionChange={(keys) => {
					const selectedCategory = Array.from(keys)[0] as string;
					updateField('category', selectedCategory);
				}}
				isInvalid={!!errors.category}
				errorMessage={errors.category}
				variant="bordered"
				radius="full"
				startContent={
					<Icon icon="lucide:folder" className="text-default-400" />
				}
				isRequired
				isDisabled={isDisabled}
			>
				{PRODUCT_CATEGORIES.map((category) => (
					<SelectItem key={category} value={category}>
						{formatCategory(category)}
					</SelectItem>
				))}
			</Select>
		</div>
	);
}
