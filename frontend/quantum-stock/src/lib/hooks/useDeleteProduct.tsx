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
        }
      });
    }
  );

  const handleError = (message: string): false => {
    if (onError) onError(new Error(message));
    return false;
  };
  
  const validateDeleteRequest = (productId: string): boolean => {
    if (!token || token.trim() === '') {
      handleError('Token de autenticación requerido');
      return false;
    }

    if (!isAdmin) {
      handleError('No tienes permisos para eliminar productos');
      return false;
    }

    if (!productId) {
      handleError('Se requiere un ID de producto para eliminarlo');
      return false;
    }
    
    return true;
  };
  
  const processDeleteError = (error: unknown): false => {
    console.error('Error al eliminar producto:', error);
    
    if (error instanceof Error) {
      let errorMessage = error.message;
      
      // Mapear códigos de error HTTP a mensajes amigables
      if (error.message.includes('401')) {
        errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      } else if (error.message.includes('403')) {
        errorMessage = 'No tienes permisos para realizar esta acción.';
      } else if (error.message.includes('404')) {
        errorMessage = 'El producto no existe o ya fue eliminado.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
      }
      
      if (onError) onError(new Error(errorMessage));
    }
    
    return false;
  };

  const deleteProductById = async (productId: string): Promise<boolean> => {
    if (!validateDeleteRequest(productId)) {
      return false;
    }

    setIsDeleting(true);

    try {
      await deleteMutation.trigger(productId);
      if (onSuccess) onSuccess(productId);
      return true;
    } catch (error) {
      return processDeleteError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteProductById,
    isDeleting: isDeleting || deleteMutation.isMutating,
  };
}