'use client';

import type Product from '@/lib/model/product.model';
import { useUpdateProduct } from '@/lib/hooks/useUpdateProduct';
import {
	Button,
	Divider,
	Input,
	Autocomplete,
	AutocompleteItem,
	Textarea,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useKeycloak } from '@react-keycloak/web';
import { useEffect, useState } from 'react';
import { getCategoriesWithoutAll, isValidCategory } from '@/lib/constants/categories.constants';
import type { Key } from 'react';

export type EditProductData = {
	id: string;
	name: string;
	description: string;
	category: string;
	price: number;
	quantity: number;
	minQuantity: number;
};

type EditProductFormProps = {
	product: Product;
	onSave?: (product: EditProductData) => Promise<void>;
	onCancel: () => void;
	isLoading?: boolean;
};

export default function EditProductForm({
	product,
	onSave,
	onCancel,
	isLoading = false,
}: Readonly<EditProductFormProps>) {
	const { keycloak } = useKeycloak();
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// Get categories without "ALL" option since we're editing a product
	const categories = getCategoriesWithoutAll();

	const [formData, setFormData] = useState<EditProductData>({
		id: product.id,
		name: product.name,
		description: product.description,
		category: product.category,
		price: product.price,
		quantity: product.quantity,
		minQuantity: product.minQuantity,
	});

	const [errors, setErrors] = useState<
		Partial<Record<keyof EditProductData, string>>
	>({});

	const [isFormValid, setIsFormValid] = useState<boolean>(true);

	// Use the update hook
	const { updateProductById, isUpdating } = useUpdateProduct({
		token: keycloak?.token ?? '',
		onSuccess: async (updatedProduct) => {
			setSuccess('Producto actualizado exitosamente');
			setError(null);
			
			// Convert Product to EditProductData for the callback
			const editProductData: EditProductData = {
				id: updatedProduct.id,
				name: updatedProduct.name,
				description: updatedProduct.description,
				category: updatedProduct.category,
				price: updatedProduct.price,
				quantity: updatedProduct.quantity,
				minQuantity: updatedProduct.minQuantity,
			};
			
			if (onSave) {
				await onSave(editProductData);
			}
		},
		onError: (err) => {
			setError(err.message);
			setSuccess(null);
		},
	});

	// Función para validar el formulario
	const validateForm = (): boolean => {
		const newErrors: Partial<Record<keyof EditProductData, string>> = {};

		if (!formData.name.trim()) {
			newErrors.name = 'El nombre es requerido';
		}

		if (!formData.description.trim()) {
			newErrors.description = 'La descripción es requerida';
		}

		if (!formData.category || !isValidCategory(formData.category)) {
			newErrors.category = 'La categoría es requerida';
		}

		if (formData.price <= 0) {
			newErrors.price = 'El precio debe ser mayor a 0';
		}

		if (formData.quantity < 0) {
			newErrors.quantity = 'La cantidad no puede ser negativa';
		}

		if (formData.minQuantity < 0) {
			newErrors.minQuantity = 'El stock mínimo no puede ser negativo';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Validar formulario cada vez que cambian los datos
	useEffect(() => {
		const isValid = validateFormSilent();
		setIsFormValid(isValid);
	}, [formData]);

	const validateFormSilent = (): boolean => {
		if (!formData.name.trim()) return false;
		if (!formData.description.trim()) return false;
		if (!formData.category || !isValidCategory(formData.category)) return false;
		if (formData.price <= 0) return false;
		if (formData.quantity < 0) return false;
		if (formData.minQuantity < 0) return false;

		return true;
	};

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

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		// Clear previous messages
		setError(null);
		setSuccess(null);

		// Validate form
		if (!validateForm()) return;

		// Check token
		if (keycloak.isTokenExpired()) {
			try {
				await keycloak.updateToken(30);
			} catch (tokenError) {
				console.error('Error al renovar token:', tokenError);
				setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
				return;
			}
		}

		// Convert EditProductData to Product format
		const productToUpdate: Product = {
			id: formData.id,
			name: formData.name,
			description: formData.description,
			category: formData.category,
			price: formData.price,
			quantity: formData.quantity,
			minQuantity: formData.minQuantity,
		};

		await updateProductById(productToUpdate);
	};

	const updateField = (
		field: keyof EditProductData,
		value: string | number,
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const handleCancel = () => {
		onCancel();
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{error && (
				<div className="p-3 mb-4 text-white bg-red-500 rounded-md">
					{error}
				</div>
			)}

			{success && (
				<div className="p-3 mb-4 text-white bg-green-500 rounded-md">
					{success}
				</div>
			)}

			{/* Información Básica */}
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
					isDisabled={isLoading || isUpdating}
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
					isDisabled={isLoading || isUpdating}
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
					isDisabled={isLoading || isUpdating}
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

			<Divider />

			{/* Información Financiera y Stock */}
			<div className="space-y-4">
				<div className="flex items-center gap-2 mb-3">
					<Icon icon="lucide:dollar-sign" className="text-success" />
					<h3 className="font-semibold">Precio y Stock</h3>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Input
						name="price"
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
						isDisabled={isLoading || isUpdating}
					/>

					<Input
						name="quantity"
						label="Cantidad Actual"
						placeholder="0"
						type="number"
						value={formData.quantity.toString()}
						onValueChange={(value) =>
							updateField('quantity', Number.parseInt(value) || 0)
						}
						isInvalid={!!errors.quantity}
						errorMessage={errors.quantity}
						startContent={
							<Icon icon="lucide:package" className="text-default-400" />
						}
						variant="bordered"
						isRequired
						isDisabled={isLoading || isUpdating}
					/>
				</div>

				<Input
					name="minQuantity"
					label="Stock Mínimo"
					placeholder="0"
					type="number"
					value={formData.minQuantity.toString()}
					onValueChange={(value) =>
						updateField('minQuantity', Number.parseInt(value) || 0)
					}
					isInvalid={!!errors.minQuantity}
					errorMessage={errors.minQuantity}
					startContent={
						<Icon icon="lucide:alert-triangle" className="text-warning" />
					}
					variant="bordered"
					description="Cantidad mínima antes de mostrar alerta de stock bajo"
					isRequired
					isDisabled={isLoading || isUpdating}
				/>
			</div>

			{/* Form Actions */}
			<div className="flex justify-end gap-3 pt-4">
				<Button
					color="danger"
					variant="flat"
					onPress={handleCancel}
					disabled={isLoading || isUpdating}
					type="button"
				>
					Cancelar
				</Button>
				<Button
					color="primary"
					type="submit"
					isLoading={isLoading || isUpdating}
					isDisabled={!isFormValid || isLoading || isUpdating}
					startContent={
						!isLoading && !isUpdating ? (
							<Icon icon="lucide:save" />
						) : null
					}
				>
					{isLoading || isUpdating
						? 'Guardando...'
						: 'Actualizar Producto'}
				</Button>
			</div>
		</form>
	);
}