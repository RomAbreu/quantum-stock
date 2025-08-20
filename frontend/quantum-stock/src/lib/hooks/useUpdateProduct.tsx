import { useState } from 'react';
import { updateProduct } from '@/lib/actions/product.action';
import type Product from '@/lib/model/product.model';
import { toast } from 'react-hot-toast';
import { useNotifications } from '@/lib/hooks/useNotifications';

type UseUpdateProductProps = {
  onSuccess?: (product: Product) => void;
  onError?: (error: Error) => void;
  token: string;
  showToast?: boolean;
  refreshNotifications?: boolean;
};

export function useUpdateProduct({
  onSuccess,
  onError,
  token,
  showToast = true,
  refreshNotifications = true,
}: UseUpdateProductProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { refetch: refetchNotifications } = useNotifications();

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

  const updateProductById = async (product: Product): Promise<boolean> => {
    if (!token || token.trim() === '') {
      const error = new Error('Token de autenticación requerido');
      if (onError) onError(error);
     
      if (showToast) {
        toast.error('❌ Token de autenticación requerido', {
          duration: 5000,
          position: 'top-right',
        });
      }
     
      return false;
    }

    if (!product.id) {
      const error = new Error('ID del producto requerido');
      if (onError) onError(error);
     
      if (showToast) {
        toast.error('❌ ID del producto requerido', {
          duration: 5000,
          position: 'top-right',
        });
      }
     
      return false;
    }

    setIsUpdating(true);

    try {
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

      await handleRefreshNotifications();

      if (showToast && updatedProduct) {
        toast.success(`✅ Producto "${updatedProduct.name}" actualizado exitosamente`, {
          duration: 4000,
          position: 'top-right',
          icon: '📝',
        });
      }

      if (onSuccess) {
        onSuccess(updatedProduct);
      }

      return true;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      let errorMessage = 'Error al actualizar el producto';
     
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
        } else if (error.message.includes('403')) {
          errorMessage = 'No tienes permisos para actualizar este producto.';
        } else if (error.message.includes('404')) {
          errorMessage = 'El producto no existe.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
        } else {
          errorMessage = error.message;
        }
      }

      if (showToast) {
        toast.error(`❌ ${errorMessage}`, {
          duration: 5000,
          position: 'top-right',
        });
      }

      if (onError) {
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
    refreshNotifications: handleRefreshNotifications,
  };
}