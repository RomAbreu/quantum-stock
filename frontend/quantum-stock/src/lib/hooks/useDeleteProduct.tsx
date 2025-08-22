import { deleteProduct } from '@/lib/actions/product.action';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useSWRMutation from 'swr/mutation';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

type UseDeleteProductProps = {
	isAdmin?: boolean;
	onSuccess?: (productId: string) => void;
	onError?: (error: Error) => void;
	token: string;
	showToast?: boolean;
	refreshNotifications?: boolean;
};

export function useDeleteProduct({
	isAdmin = false,
	onSuccess,
	onError,
	token,
	showToast = true,
	refreshNotifications = true,
}: UseDeleteProductProps) {
	const [isDeleting, setIsDeleting] = useState(false);

	const { refetch: refetchNotifications } = useNotifications();

	const deleteMutation = useSWRMutation(
		API_URL,
		async (key, { arg }: { arg: string }) => {
			return deleteProduct({
				productId: arg,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
		},
	);

	const handleRefreshNotifications = async () => {
		if (refreshNotifications) {
			try {
				await refetchNotifications();
				console.log(
					'✅ Notificaciones refrescadas exitosamente después de eliminar producto',
				);
			} catch (error) {
				console.warn('⚠️ Error al refrescar notificaciones:', error);
			}
		}
	};

	const handleError = (message: string): false => {
		if (showToast) {
			toast.error(`❌ ${message}`, {
				duration: 5000,
				position: 'top-right',
			});
		}

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

		let errorMessage = 'Error al eliminar el producto';

		if (error instanceof Error) {
			if (error.message.includes('401')) {
				errorMessage =
					'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
			} else if (error.message.includes('403')) {
				errorMessage = 'No tienes permisos para realizar esta acción.';
			} else if (error.message.includes('404')) {
				errorMessage = 'El producto no existe o ya fue eliminado.';
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

		if (onError) onError(new Error(errorMessage));
		return false;
	};

	const deleteProductById = async (
		productId: string,
		productName?: string,
	): Promise<boolean> => {
		if (!validateDeleteRequest(productId)) {
			return false;
		}

		setIsDeleting(true);

		try {
			await deleteMutation.trigger(productId);

			await handleRefreshNotifications();

			if (showToast) {
				const successMessage = productName
					? `Producto "${productName}" eliminado exitosamente`
					: 'Producto eliminado exitosamente';

				toast.success(`🗑️ ${successMessage}`, {
					duration: 4000,
					position: 'top-right',
					icon: '✅',
				});
			}

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
		refreshNotifications: handleRefreshNotifications,
	};
}
