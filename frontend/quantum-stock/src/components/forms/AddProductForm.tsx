'use client';

import {
	Button,
	Divider,
	Input,
	Select,
	SelectItem,
	Textarea,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';

export type NewProductData = {
	name: string;
	description: string;
	category: string;
	price: number;
	initialQuantity: number;
	minimumStock: number;
};

type AddProductFormProps = {
	onSave: (product: NewProductData) => Promise<void>;
	onCancel: () => void;
	categories: string[];
	isLoading?: boolean;
};

export default function AddProductForm({
	onSave,
	onCancel,
	categories,
	isLoading = false,
}: Readonly<AddProductFormProps>) {
	const [formData, setFormData] = useState<NewProductData>({
		name: '',
		description: '',
		category: '',
		price: 0,
		initialQuantity: 0,
		minimumStock: 0,
	});

	const [errors, setErrors] = useState<
		Partial<Record<keyof NewProductData, string>>
	>({});

	const validateForm = (): boolean => {
		const newErrors: Partial<Record<keyof NewProductData, string>> = {};

		if (!formData.name.trim()) {
			newErrors.name = 'El nombre es requerido';
		}

		if (!formData.description.trim()) {
			newErrors.description = 'La descripción es requerida';
		}

		if (!formData.category) {
			newErrors.category = 'La categoría es requerida';
		}

		if (formData.price <= 0) {
			newErrors.price = 'El precio debe ser mayor a 0';
		}

		if (formData.initialQuantity < 0) {
			newErrors.initialQuantity = 'La cantidad inicial no puede ser negativa';
		}

		if (formData.minimumStock < 0) {
			newErrors.minimumStock = 'El stock mínimo no puede ser negativo';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		try {
			await onSave(formData);
			// Reset form after successful save
			setFormData({
				name: '',
				description: '',
				category: '',
				price: 0,
				initialQuantity: 0,
				minimumStock: 0,
			});
			setErrors({});
		} catch (error) {
			console.error('Error saving product:', error);
		}
	};

	const updateField = (field: keyof NewProductData, value: string | number) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const resetForm = () => {
		setFormData({
			name: '',
			description: '',
			category: '',
			price: 0,
			initialQuantity: 0,
			minimumStock: 0,
		});
		setErrors({});
	};

	const handleCancel = () => {
		resetForm();
		onCancel();
	};

	return (
		<div className="space-y-6">
			{/* Información Básica */}
			<div className="space-y-4">
				<div className="flex items-center gap-2 mb-3">
					<Icon icon="lucide:info" className="text-primary" />
					<h3 className="font-semibold">Información Básica</h3>
				</div>

				<Input
					label="Nombre del Producto"
					placeholder="Ej: Laptop Dell XPS 13"
					value={formData.name}
					onValueChange={(value) => updateField('name', value)}
					isInvalid={!!errors.name}
					errorMessage={errors.name}
					startContent={<Icon icon="lucide:tag" className="text-default-400" />}
					variant="bordered"
					isRequired
					isDisabled={isLoading}
				/>

				<Textarea
					label="Descripción"
					placeholder="Describe las características principales del producto..."
					value={formData.description}
					onValueChange={(value) => updateField('description', value)}
					isInvalid={!!errors.description}
					errorMessage={errors.description}
					variant="bordered"
					minRows={3}
					isRequired
					isDisabled={isLoading}
				/>

				<Select
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
					startContent={
						<Icon icon="lucide:folder" className="text-default-400" />
					}
					isRequired
					isDisabled={isLoading}
				>
					<>
						{categories.map((category) => (
							<SelectItem key={category}>{category}</SelectItem>
						))}
					</>
				</Select>
			</div>

			<Divider />

			{/* Información Financiera y Stock */}
			<div className="space-y-4">
				<div className="flex items-center gap-2 mb-3">
					<Icon icon="lucide:dollar-sign" className="text-success" />
					<h3 className="font-semibold">Precio y Stock</h3>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Input
						label="Precio"
						placeholder="0.00"
						type="number"
						value={formData.price.toString()}
						onValueChange={(value) =>
							updateField('price', Number.parseFloat(value) || 0)
						}
						isInvalid={!!errors.price}
						errorMessage={errors.price}
						startContent={
							<div className="flex items-center pointer-events-none">
								<span className="text-default-400 text-small">$</span>
							</div>
						}
						variant="bordered"
						isRequired
						isDisabled={isLoading}
					/>

					<Input
						label="Cantidad Inicial"
						placeholder="0"
						type="number"
						value={formData.initialQuantity.toString()}
						onValueChange={(value) =>
							updateField('initialQuantity', Number.parseInt(value) || 0)
						}
						isInvalid={!!errors.initialQuantity}
						errorMessage={errors.initialQuantity}
						startContent={
							<Icon icon="lucide:package" className="text-default-400" />
						}
						variant="bordered"
						isRequired
						isDisabled={isLoading}
					/>
				</div>

				<Input
					label="Stock Mínimo"
					placeholder="0"
					type="number"
					value={formData.minimumStock.toString()}
					onValueChange={(value) =>
						updateField('minimumStock', Number.parseInt(value) || 0)
					}
					isInvalid={!!errors.minimumStock}
					errorMessage={errors.minimumStock}
					startContent={
						<Icon icon="lucide:alert-triangle" className="text-warning" />
					}
					variant="bordered"
					description="Cantidad mínima antes de mostrar alerta de stock bajo"
					isRequired
					isDisabled={isLoading}
				/>
			</div>

			{/* Form Actions */}
			<div className="flex justify-end gap-3 pt-4">
				<Button
					color="danger"
					variant="solid"
					onPress={handleCancel}
					disabled={isLoading}
				>
					Cancelar
				</Button>
				<Button
					color="primary"
					onPress={handleSubmit}
					isLoading={isLoading}
					startContent={!isLoading ? <Icon icon="lucide:save" /> : null}
				>
					{isLoading ? 'Guardando...' : 'Guardar Producto'}
				</Button>
			</div>
		</div>
	);
}
