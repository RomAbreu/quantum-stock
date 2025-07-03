import { useState } from 'react';
import { updateProduct } from '@/lib/actions/product.action';
import type Product from '@/lib/model/product.model';

type UseUpdateProductProps = {
  onSuccess?: (product: Product) => void;
  onError?: (error: Error) => void;
  token: string;
};

export function useUpdateProduct({
  onSuccess,
  onError,
  token,
}: UseUpdateProductProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProductById = async (product: Product): Promise<boolean> => {
    if (!token || token.trim() === '') {
      const error = new Error('Token de autenticación requerido');
      if (onError) onError(error);
      return false;
    }

    if (!product.id) {
      const error = new Error('ID del producto requerido');
      if (onError) onError(error);
      return false;
    }

    setIsUpdating(true);

    try {
      // Formatea la categoría a mayúsculas y reemplaza espacios con guiones bajos
      const formattedProduct = {
        ...product,
        category: product.category.toUpperCase().replace(/ /g, '_')
      };

      const updatedProduct = await updateProduct({
        product: formattedProduct,
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (onSuccess) {
        onSuccess(updatedProduct);
      }

      return true;
    } catch (error) {
      console.error('Error al actualizar producto:', error);

      if (onError && error instanceof Error) {
        let errorMessage = error.message;
        
        if (error.message.includes('401')) {
          errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
        } else if (error.message.includes('403')) {
          errorMessage = 'No tienes permisos para actualizar este producto.';
        } else if (error.message.includes('404')) {
          errorMessage = 'El producto no existe.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
        }
        
        onError(new Error(errorMessage));
      }

      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateProductById,
    isUpdating,
  };
}