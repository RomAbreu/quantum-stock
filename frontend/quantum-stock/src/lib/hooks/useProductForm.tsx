'use client';

import { createProduct } from '@/lib/actions/product.action';
import type { NewProductData } from '@components/forms/types/product.types';
import { useEffect, useState, useTransition } from 'react';
import { useFormState } from 'react-dom';

const initialFormState:
	| { success: boolean; product: any; errors?: never }
	| { errors: { createProduct: string }; success?: never; product?: never } = {
	success: false,
	product: null,
};

export default function useProductForm(
	onSave?: (product: NewProductData) => Promise<void>,
	onCancel?: () => void,
	onChange?: () => void, // Añadimos el parámetro onChange
) {
	// Form state para server action
	const [state, formAction] = useFormState(createProduct, initialFormState);
	const [isPending, startTransition] = useTransition();

	const [formData, setFormData] = useState<NewProductData>({
		name: '',
		description: '',
		category: '',
		price: 0,
		initialQuantity: 0,
		minQuantity: 0,
	});

	const [errors, setErrors] = useState<
		Partial<Record<keyof NewProductData, string>>
	>({});
	const [isFormValid, setIsFormValid] = useState<boolean>(false);
	const [submitting, setSubmitting] = useState(false);

	// Validar formulario cada vez que cambian los datos
	useEffect(() => {
		const isValid = validateFormSilent();
		setIsFormValid(isValid);
	}, [formData]);

	// Versión silenciosa de validateForm que no establece errores
	const validateFormSilent = (): boolean => {
		if (!formData.name.trim()) return false;
		if (!formData.description.trim()) return false;
		if (!formData.category) return false;
		if (formData.price <= 0) return false;
		if (formData.initialQuantity < 0) return false;
		if (formData.minQuantity < 0) return false;

		return true;
	};

	// Función para validar el formulario y mostrar errores
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

		if (formData.minQuantity < 0) {
			newErrors.minQuantity = 'El stock mínimo no puede ser negativo';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const updateField = (field: keyof NewProductData, value: string | number) => {
		setFormData((prev) => ({ ...prev, [field]: value }));

		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}

		// Notificar cambio
		if (onChange) {
			onChange();
		}
	};

	const resetForm = () => {
		setFormData({
			name: '',
			description: '',
			category: '',
			price: 0,
			initialQuantity: 0,
			minQuantity: 0,
		});
		setErrors({});
	};

	const handleCancel = () => {
		resetForm();
		if (onCancel) onCancel();
	};

	const handleServerAction = async (
		event: React.FormEvent<HTMLFormElement>,
		token: string | undefined,
	) => {
		event.preventDefault();

		// Validación completa al intentar enviar (muestra errores)
		if (!validateForm()) return;

		if (!token) {
			setErrors((prev) => ({
				...prev,
				form: 'Token de autenticación no encontrado. Por favor, inicie sesión nuevamente.',
			}));
			return;
		}

		setSubmitting(true);

		try {
			console.log('Sending product data:', formData);

			const formDataObj = new FormData();
			// Aquí añadir todos los campos del formulario al FormData
			Object.entries(formData).forEach(([key, value]) => {
				formDataObj.append(key, value.toString());
			});

			startTransition(() => {
				formAction({ formData: formDataObj, token });
			});

			console.log('Server action response:', state);

			if (state?.errors?.createProduct) {
				throw new Error(state.errors.createProduct);
			}

			if (onSave) {
				await onSave(formData);
			}

			resetForm();
		} catch (error) {
			console.error('Error during product creation:', error);
			setErrors((prev) => ({
				...prev,
				form:
					error instanceof Error
						? error.message
						: 'Error al guardar el producto',
			}));
		} finally {
			setSubmitting(false);
		}
	};

	return {
		formData,
		errors,
		isFormValid,
		submitting,
		isPending,
		state,
		updateField,
		handleServerAction,
		handleCancel,
	};
}
