import { useState } from 'react';
import useSWRMutation from 'swr/mutation';
import { deleteProduct } from '@/lib/actions/product.action';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

type UseDeleteProductProps = {
  isAdmin?: boolean;
  onSuccess?: (productId: string) => void;
  onError?: (error: Error) => void;
  token: string;
};

export function useDeleteProduct({
  isAdmin = false,
  onSuccess,
  onError,
  token,
}: UseDeleteProductProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteMutation = useSWRMutation(
    API_URL,
    async (key, { arg }: { arg: string }) => {
      return deleteProduct({
        productId: arg,
        headers: { 
          Authorization: `Bearer ${token}`, // ← Agregado "Bearer " prefix
          'Content-Type': 'application/json'
        }
      });
    }
  );

  const deleteProductById = async (productId: string): Promise<boolean> => {
    // Validar token antes de continuar
    if (!token || token.trim() === '') {
      const error = new Error('Token de autenticación requerido');
      if (onError) onError(error);
      return false;
    }

    if (!isAdmin) {
      const error = new Error('No tienes permisos para eliminar productos');
      if (onError) onError(error);
      return false;
    }

    if (!productId) {
      const error = new Error('Se requiere un ID de producto para eliminarlo');
      if (onError) onError(error);
      return false;
    }

    setIsDeleting(true);

    try {
      await deleteMutation.trigger(productId);

      if (onSuccess) {
        onSuccess(productId);
      }

      return true;
    } catch (error) {
      console.error('Error al eliminar producto:', error);

      // Manejar errores específicos
      if (error instanceof Error) {
        let errorMessage = error.message;
        
        // Si el error contiene información de respuesta HTTP
        if (error.message.includes('401')) {
          errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
        } else if (error.message.includes('403')) {
          errorMessage = 'No tienes permisos para realizar esta acción.';
        } else if (error.message.includes('404')) {
          errorMessage = 'El producto no existe o ya fue eliminado.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
        }
        
        if (onError) {
          onError(new Error(errorMessage));
        }
      }

      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteProductById,
    isDeleting: isDeleting || deleteMutation.isMutating,
  };
}