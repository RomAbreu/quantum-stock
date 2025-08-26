'use client';

import {
	getCategoriesWithoutAll,
	isValidCategory,
} from '@/lib/constants/categories.constants';
import { useUpdateProduct } from '@/lib/hooks/useUpdateProduct';
import type Product from '@/lib/model/product.model';
import {
	Autocomplete,
	AutocompleteItem,
	Divider,
	Input,
	Textarea,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useKeycloak } from '@react-keycloak/web';
import { useEffect, useState } from 'react';
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
	showToast?: boolean;
};

export default function EditProductForm({
	product,
	onSave,
	onCancel,
	isLoading = false,
	showToast = true,
}: Readonly<EditProductFormProps>) {
	const { keycloak } = useKeycloak();

	const [formError, setFormError] = useState<string | null>(null);

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

	const { updateProductById, isUpdating } = useUpdateProduct({
		token: keycloak?.token ?? '',
		showToast,
		onSuccess: (updatedProduct) => {
			setFormError(null);

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
				onSave(editProductData);
			}
		},
		onError: (err) => {
			if (err.message.includes('Token') || err.message.includes('sesión')) {
				setFormError(
					'Tu sesión ha expirado. Por favor, refresca la página e inicia sesión nuevamente.',
				);
			}
		},
	});

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

	useEffect(() => {
		const isValid = validateFormSilent(formData);
		setIsFormValid(isValid);
	}, [formData]);

	const validateFormSilent = (data: EditProductData): boolean => {
		if (!data.name.trim()) return false;
		if (!data.description.trim()) return false;
		if (!data.category || !isValidCategory(data.category)) return false;
		if (data.price <= 0) return false;
		if (data.quantity < 0) return false;
		if (data.minQuantity < 0) return false;

		return true;
	};

	const handleCategoryChange = (key: Key | null) => {
		const selectedCategory = key?.toString() ?? '';

		if (selectedCategory && isValidCategory(selectedCategory)) {
			updateField('category', selectedCategory);
		} else {
			updateField('category', '');
		}
	};

	const selectedCategoryKey =
		formData.category && isValidCategory(formData.category)
			? formData.category
			: null;

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setFormError(null);

		if (!validateForm()) return;

		if (keycloak.isTokenExpired()) {
			try {
				await keycloak.updateToken(30);
			} catch (tokenError) {
				console.error('Error al renovar token:', tokenError);
				setFormError(
					'Tu sesión ha expirado. Por favor, refresca la página e inicia sesión nuevamente.',
				);
				return;
			}
		}

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
		if (formError) {
			setFormError(null);
		}
	};

	const handleCancel = () => {
		onCancel();
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{formError && (
				<div className="p-3 mb-4 text-white bg-red-500 rounded-md">
					{formError}
				</div>
			)}

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
			
			<div className="flex justify-end gap-3 pt-4">
				<button
					type="button"
					onClick={handleCancel}
					disabled={isLoading || isUpdating}
					className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors border rounded-md border-danger-200 bg-danger-50 text-danger-600 hover:bg-danger-100 focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Cancelar
				</button>
				
				<button
					type="submit"
					disabled={!isFormValid || isLoading || isUpdating}
					className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
						isLoading || isUpdating
							? 'bg-primary-400 border-primary-400'
							: 'bg-primary-600 border-primary-600 hover:bg-primary-700'
					}`}
				>
					{isLoading || isUpdating && (
						<svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
								fill="none"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
					)}
					{!isLoading && !isUpdating && (
						<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
							<polyline points="17,21 17,13 7,13 7,21"/>
							<polyline points="7,3 7,8 15,8"/>
						</svg>
					)}
					{isLoading || isUpdating ? 'Guardando...' : 'Actualizar Producto'}
				</button>
			</div>
		</form>
	);
}
