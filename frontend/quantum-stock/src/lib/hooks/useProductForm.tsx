'use client';

import { createProduct, updateProduct } from '@/lib/actions/product.action';
import type { NewProductData } from '@components/forms/types/product.types';
import type Product from '@/lib/model/product.model';
import { useState, useEffect } from 'react';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-hot-toast';
import { useNotifications } from '@/lib/hooks/useNotifications';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

type FormErrors = Partial<Record<keyof NewProductData, string>> & { form?: string };

type UseProductFormProps = {
  mode?: 'create' | 'edit';
  initialProduct?: Product;
  onSuccess?: (product: Product) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  onChange?: () => void;
  token: string;
  showToast?: boolean;
  refreshNotifications?: boolean;
};

export default function useProductForm({
  mode = 'create',
  initialProduct,
  onSuccess,
  onError,
  onCancel,
  onChange,
  token,
  showToast = true,
  refreshNotifications = true,
}: UseProductFormProps) {
  const { refetch: refetchNotifications } = useNotifications();

  const [formData, setFormData] = useState<NewProductData>({
    name: initialProduct?.name ?? '',
    description: initialProduct?.description ?? '',
    category: initialProduct?.category ?? '',
    price: initialProduct?.price ?? 0,
    quantity: initialProduct?.quantity ?? 0,
    minQuantity: initialProduct?.minQuantity ?? 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const createMutation = useSWRMutation(
    `${API_URL}/products`,
    (key, { arg }: { arg: NewProductData }) =>
      createProduct({
        url: key,
        product: arg,
        headers: { Authorization: `Bearer ${token}` },
      })
  );

  const updateMutation = useSWRMutation(
    mode === 'edit' && initialProduct?.id ? `${API_URL}` : null,
    (key, { arg }: { arg: Product }) =>
      updateProduct({
        url: `${key}/products/${arg.id}`,
        product: arg,
        headers: { Authorization: `Bearer ${token}` },
      })
  );

  useEffect(() => {
    const isValid = validateFormSilent();
    setIsFormValid(isValid);
    
    if (onChange) {
      onChange();
    }
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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
      newErrors.quantity = 'La cantidad inicial no puede ser negativa';
    }

    if (formData.minQuantity < 0) {
      newErrors.minQuantity = 'El stock mínimo no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field: keyof NewProductData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
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
      quantity: 0,
      minQuantity: 0,
    });
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
    if (onCancel) onCancel();
  };

  const handleRefreshNotifications = async () => {
    if (refreshNotifications) {
      try {
        await refetchNotifications();
        console.log('✅ Notificaciones refrescadas exitosamente');
      } catch (error) {
        console.warn('⚠️ Error al refrescar notificaciones:', error);
      }
    }
  };

  const submitForm = async (): Promise<Product | null> => {
    if (!validateForm()) {
      return null;
    }

    try {
      if (!token) {
        throw new Error('Token de autenticación no encontrado. Por favor, inicie sesión nuevamente.');
      }

      const formattedData = {
        ...formData,
        category: formData.category.toUpperCase().replace(/ /g, '_')
      };

      let result;

      if (mode === 'create') {
        result = await createMutation.trigger(formattedData);
        
        if (showToast && result) {
          toast.success(`Producto "${result.name}" creado exitosamente`, {
            duration: 4000,
            position: 'top-right',
            icon: '✅',
          });
        }
      } else if (mode === 'edit' && initialProduct?.id) {
        result = await updateMutation.trigger({
          ...formattedData,
          id: initialProduct.id,
          quantity: formattedData.quantity,
        } as Product);
        
        if (showToast && result) {
          toast.success(`Producto "${result.name}" actualizado exitosamente`, {
            duration: 4000,
            position: 'top-right',
            icon: '📝',
          });
        }
      }

      if (result) {
        await handleRefreshNotifications();
      }

      if (onSuccess && result) {
        onSuccess(result);
      }

      resetForm();
      return result || null;
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} product:`, error);
      
      if (showToast) {
        const errorMessage = error instanceof Error ? error.message : 'Error al procesar el producto';
        toast.error(errorMessage, {
          duration: 5000,
          position: 'top-right',
          icon: '❌',
        });
      }
      
      if (onError && error instanceof Error) {
        onError(error);
      }
      
      setErrors((prev) => ({
        ...prev,
        form: error instanceof Error 
          ? error.message 
          : 'Error al procesar el producto',
      }));
      
      return null;
    }
  };

  const isSubmitting = 
    mode === 'create' 
      ? createMutation.isMutating 
      : updateMutation.isMutating;

  return {
    formData,
    errors,
    isFormValid,
    isSubmitting,
    updateField,
    handleCancel,
    submitForm,
    resetForm,
    refreshNotifications: handleRefreshNotifications,
  };
}