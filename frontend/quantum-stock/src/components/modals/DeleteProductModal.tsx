'use client';

import { useDeleteProduct } from '@/lib/hooks/useDeleteProduct';
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useKeycloak } from '@react-keycloak/web';
import { useState } from 'react';

interface DeleteProductModalProps {
	isOpen: boolean;
	onClose: () => void;
	productId: string;
	productName: string;
	onDelete?: (productId: string) => void;
	showToast?: boolean;
	refreshNotifications?: boolean;
}

export default function DeleteProductModal({
	isOpen,
	onClose,
	productId,
	productName,
	onDelete,
	showToast = true,
	refreshNotifications = true,
}: Readonly<DeleteProductModalProps>) {
	const [error, setError] = useState<string | null>(null);
	const { keycloak } = useKeycloak();

	const isAdmin =
		keycloak.resourceAccess?.['quantum-stock-frontend']?.roles?.includes(
			'admin',
		) || false;
	const token = keycloak?.token ?? '';

	const { deleteProductById, isDeleting } = useDeleteProduct({
		isAdmin,
		token,
		showToast,
		refreshNotifications,
		onSuccess: (id) => {
			setError(null);

			if (onDelete) {
				onDelete(id);
			}
			onClose();
		},
		onError: (err) => {
			if (!showToast) {
				setError(err.message);
			}
		},
	});

	const handleDelete = async () => {
		setError(null);

		await deleteProductById(productId, productName);
	};

	const handleClose = () => {
		setError(null);
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			backdrop="blur"
			isDismissable={!isDeleting}
			hideCloseButton={isDeleting}
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20">
							<Icon
								icon="solar:trash-bin-minimalistic-bold"
								className="text-lg text-red-500"
							/>
						</div>
						<span className="text-lg font-semibold">Eliminar Producto</span>
					</div>
				</ModalHeader>

				<ModalBody>
					{error && !showToast && (
						<div className="flex items-center gap-2 p-3 mb-4 text-red-800 bg-red-100 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
							<Icon icon="solar:danger-triangle-bold" className="text-lg" />
							<span className="text-sm">{error}</span>
						</div>
					)}

					<div className="space-y-3">
						<p className="text-base">
							¿Estás seguro que deseas eliminar el producto{' '}
							<span className="font-bold text-primary">{productName}</span>?
						</p>

						<div className="flex items-start gap-2 p-3 rounded-lg bg-warning-50 dark:bg-warning-900/20">
							<Icon
								icon="solar:danger-triangle-bold"
								className="mt-0.5 text-warning-500 flex-shrink-0"
							/>
							<div className="text-sm text-warning-700 dark:text-warning-300">
								<p className="mb-1 font-medium">Esta acción es irreversible</p>
								<p>
									El producto será eliminado permanentemente del inventario y no
									podrá ser recuperado.
								</p>
							</div>
						</div>
					</div>
				</ModalBody>

				<ModalFooter className="gap-2">
					<Button
						variant="flat"
						onPress={handleClose}
						disabled={isDeleting}
						className="font-medium"
					>
						Cancelar
					</Button>

					<Button
						color="danger"
						onPress={handleDelete}
						isLoading={isDeleting}
						disabled={isDeleting}
						startContent={
							!isDeleting ? (
								<Icon
									icon="solar:trash-bin-minimalistic-bold"
									className="text-lg"
								/>
							) : null
						}
						className="font-medium min-w-[120px]"
					>
						{isDeleting ? 'Eliminando...' : 'Eliminar'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
