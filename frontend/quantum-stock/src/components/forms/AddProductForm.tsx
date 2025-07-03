'use client';

import { Divider } from '@heroui/react';
import { useKeycloak } from '@react-keycloak/web';

import BasicInformationSection from '@/components/addproduct/BasicInformationSection';
import FormActions from '@/components/addproduct/FormActions';
import FormErrorDisplay from '@/components/addproduct/FormErrorDisplay';
import PricingAndStockSection from '@/components/addproduct/PricingAndStockSection';
import type { NewProductData } from '@components/forms/types/product.types';
import useProductForm from '../../lib/hooks/useProductForm';

export default function AddProductForm({
	onSave,
	onCancel,
	isLoading = false,
	onChange, // Nuevo prop
}: Readonly<{
	onSave?: (product: NewProductData) => Promise<void>;
	onCancel: () => void;
	isLoading?: boolean;
	onChange?: () => void; // Callback para notificar cambios
}>) {
	const { keycloak: Keycloak } = useKeycloak();
	const user = { token: Keycloak?.token };

	const {
		formData,
		errors,
		isFormValid,
		submitting,
		isPending,
		state,
		updateField,
		handleServerAction,
		handleCancel,
	} = useProductForm(onSave, onCancel, onChange);

	// Handler que envuelve handleServerAction para pasar el token
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		handleServerAction(event, user.token);
	};

	// Determinar si los campos deben estar deshabilitados
	const isDisabled = isLoading || submitting || isPending;

	// Obtener error del servidor
	const serverError = state?.errors?.createProduct;

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Errores del servidor */}
			<FormErrorDisplay error={serverError} />

			{/* Información Básica */}
			<BasicInformationSection
				formData={formData}
				errors={errors}
				updateField={updateField}
				isDisabled={isDisabled}
			/>

			<Divider />

			{/* Información Financiera y Stock */}
			<PricingAndStockSection
				formData={formData}
				errors={errors}
				updateField={updateField}
				isDisabled={isDisabled}
			/>

			{/* Form Actions */}
			<FormActions
				onCancel={handleCancel}
				isLoading={isLoading}
				submitting={submitting}
				isPending={isPending}
				isFormValid={isFormValid}
			/>
		</form>
	);
}
