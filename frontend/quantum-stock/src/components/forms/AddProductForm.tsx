'use client';

import { Divider } from '@heroui/react';
import { useKeycloak } from '@react-keycloak/web';

import BasicInformationSection from '@/components/addproduct/BasicInformationSection';
import FormActions from '@/components/addproduct/FormActions';
import FormErrorDisplay from '@/components/addproduct/FormErrorDisplay';
import PricingAndStockSection from '@/components/addproduct/PricingAndStockSection';
import useProductForm from '@/lib/hooks/useProductForm';
import type Product from '@/lib/model/product.model';

export default function AddProductForm({
  onSave,
  onCancel,
  isLoading = false,
  onChange,
}: Readonly<{
  onSave?: (product: Product) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  onChange?: () => void;
}>) {
  const { keycloak } = useKeycloak();
  const token = keycloak?.token ?? '';

  const {
    formData,
    errors,
    isFormValid,
    isSubmitting,
    updateField,
    handleCancel,
    submitForm,
  } = useProductForm({
    mode: 'create',
    onSuccess: async (product) => {
      if (onSave) await onSave(product);
    },
    onError: (error) => console.error('Error creating product:', error),
    onCancel,
    onChange,
    token,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitForm();
  };

  // Determine if fields should be disabled
  const isDisabled = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form error display */}
      <FormErrorDisplay error={errors.form} />

      {/* Basic Information */}
      <BasicInformationSection
        formData={formData}
        errors={errors}
        updateField={updateField}
        isDisabled={isDisabled}
      />

      <Divider />

      {/* Pricing and Stock */}
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
        submitting={isSubmitting}
        isPending={false}
        isFormValid={isFormValid}
      />
    </form>
  );
}