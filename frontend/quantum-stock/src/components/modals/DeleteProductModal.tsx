'use client';

import { useDeleteProduct } from '@/lib/hooks/useDeleteProduct';
import {
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
					<button
						type="button"
						onClick={handleClose}
						disabled={isDeleting}
						className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors border rounded-md border-default-200 bg-default-50 text-default-600 hover:bg-default-100 focus:outline-none focus:ring-2 focus:ring-default-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Cancelar
					</button>
				
					<button
						type="button"
						onClick={handleDelete}
						disabled={isDeleting}
						className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] ${
							isDeleting
								? 'bg-danger-400 border-danger-400'
								: 'bg-danger-600 border-danger-600 hover:bg-danger-700'
						}`}
					>
						{!isDeleting && (
							<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M3 6h18"/>
								<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
								<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
								<line x1="10" y1="11" x2="10" y2="17"/>
								<line x1="14" y1="11" x2="14" y2="17"/>
							</svg>
						)}
						{isDeleting && (
							<svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
									fill="none"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
						)}
						{isDeleting ? 'Eliminando...' : 'Eliminar'}
					</button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
