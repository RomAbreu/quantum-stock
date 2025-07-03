'use client';

import type { StockItem } from '@/components/tables/StockTable';
import { updateProduct } from '@/lib/actions/product.action';
import { PRODUCT_CATEGORIES } from '@/lib/constants/categories.constants';
import { formatCategory } from '@/lib/utils/category.utils';
import {
	Button,
	Divider,
	Input,
	Select,
	SelectItem,
	Textarea,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useKeycloak } from '@react-keycloak/web';
import { useEffect, useState, useTransition } from 'react';
import { useFormState } from 'react-dom';

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
	product: StockItem;
	onSave?: (product: EditProductData) => Promise<void>;
	onCancel: () => void;
	isLoading?: boolean;
};

const initialState: {
	success?: boolean;
	product?: any;
	errors?: { updateProduct?: string };
} = {
	errors: {},
};

export default function EditProductForm({
	product,
	onSave,
	onCancel,
	isLoading = false,
}: Readonly<EditProductFormProps>) {
	// Form state para server action
	const [state, formAction] = useFormState(updateProduct, initialState);
	const [isPending, startTransition] = useTransition();

	const { keycloak: Keycloak } = useKeycloak();

	const user = {
		token: Keycloak?.token,
	};

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
	const [submitting, setSubmitting] = useState(false);

	// Función para validar el formulario
	const validateForm = (): boolean => {
		const newErrors: Partial<Record<keyof EditProductData, string>> = {};

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
		if (!formData.category) return false;
		if (formData.price <= 0) return false;
		if (formData.quantity < 0) return false;
		if (formData.minQuantity < 0) return false;

		return true;
	};

	const handleServerAction = async (
		event: React.FormEvent<HTMLFormElement>,
	) => {
		event.preventDefault();

		// Validación completa al intentar enviar (muestra errores)
		if (!validateForm()) return;

		const userToken = user?.token;

		if (!userToken) {
			setErrors((prev) => ({
				...prev,
				form: 'Token de autenticación no encontrado',
			}));
			return;
		}

		setSubmitting(true);

		try {
			const formDataObj = new FormData();
			formDataObj.append('id', formData.id);
			formDataObj.append('name', formData.name);
			formDataObj.append('description', formData.description);
			formDataObj.append('category', formData.category);
			formDataObj.append('price', formData.price.toString());
			formDataObj.append('quantity', formData.quantity.toString());
			formDataObj.append('minQuantity', formData.minQuantity.toString());

			startTransition(() => {
				formAction({ formData: formDataObj, token: userToken });
			});

			// Verificar si hay errores después de la actualización
			if (!state?.errors?.updateProduct) {
				// Si no hay errores, notificar al componente padre con los datos actualizados
				if (onSave) {
					await onSave(formData);
				}
			}
		} catch (error) {
			setErrors((prev) => ({
				...prev,
				form:
					error instanceof Error
						? error.message
						: 'Error al actualizar el producto',
			}));
		} finally {
			setSubmitting(false);
		}
	};

	useEffect(() => {
		// Si la acción del servidor fue exitosa y no estamos en estado de carga
		if (state?.success && !isPending && !submitting) {
			// Llamar a onSave para realizar el refetch
			if (onSave) {
				onSave(formData).catch(console.error);
			}
		}
	}, [state?.success, isPending, submitting]);

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

	// Mostrar errores del server
	const serverError = state?.errors?.updateProduct;

	return (
		<form onSubmit={handleServerAction} className="space-y-6">
			{serverError && (
				<div className="p-3 mb-4 text-white bg-red-500 rounded-md">
					{serverError}
				</div>
			)}

			{/* Campo oculto para el ID */}
			<input type="hidden" name="id" value={formData.id} />

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
					isDisabled={isLoading || submitting}
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
					isDisabled={isLoading || submitting}
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
					isDisabled={isLoading || submitting}
				>
					{PRODUCT_CATEGORIES.map((category) => (
						<SelectItem key={category} value={category}>
							{formatCategory(category)}
						</SelectItem>
					))}
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
						isDisabled={isLoading || submitting}
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
						isDisabled={isLoading || submitting}
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
					isDisabled={isLoading || submitting}
				/>
			</div>

			{/* Form Actions */}
			<div className="flex justify-end gap-3 pt-4">
				<Button
					color="danger"
					variant="flat"
					onPress={handleCancel}
					disabled={isLoading || submitting || isPending}
					type="button"
				>
					Cancelar
				</Button>
				<Button
					color="primary"
					type="submit"
					isLoading={isLoading || submitting || isPending}
					isDisabled={!isFormValid || isLoading || submitting || isPending}
					startContent={
						!isLoading && !submitting && !isPending ? (
							<Icon icon="lucide:save" />
						) : null
					}
				>
					{isLoading || submitting || isPending
						? 'Guardando...'
						: 'Actualizar Producto'}
				</Button>
			</div>
		</form>
	);
}
