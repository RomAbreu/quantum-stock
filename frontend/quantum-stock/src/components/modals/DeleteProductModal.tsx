'use client';

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';

interface DeleteProductModalProps {
	isOpen: boolean;
	onClose: () => void;
	productId: string;
	productName: string;
	onDelete: (id: string) => void;
}

export default function DeleteProductModal({
	isOpen,
	onClose,
	productId,
	productName,
	onDelete,
}: Readonly<DeleteProductModalProps>) {
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			setError(null);

			// Llama a la función onDelete que manejará la eliminación y el refetch
			onDelete(productId);

			// Cierra el modal solo después de una eliminación exitosa
			onClose();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Error al eliminar el producto',
			);
		} finally {
			setIsDeleting(false);
		}
	};

	// Reset del estado de error cuando se cierra el modal
	const handleClose = () => {
		setError(null);
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} backdrop="blur">
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<Icon icon="lucide:trash-2" className="text-danger" />
						<span>Eliminar Producto</span>
					</div>
				</ModalHeader>
				<ModalBody>
					{error && (
						<div className="p-3 mb-4 text-white bg-red-500 rounded-md">
							{error}
						</div>
					)}
					<p>
						¿Estás seguro que deseas eliminar el producto{' '}
						<span className="font-bold">{productName}</span>?
					</p>
					<p className="text-sm text-default-500">
						Esta acción es irreversible y eliminará permanentemente este
						producto del inventario.
					</p>
				</ModalBody>
				<ModalFooter>
					<Button variant="flat" onPress={handleClose} disabled={isDeleting}>
						Cancelar
					</Button>
					<Button
						color="danger"
						onPress={handleDelete}
						isLoading={isDeleting}
						startContent={!isDeleting ? <Icon icon="lucide:trash-2" /> : null}
					>
						{isDeleting ? 'Eliminando...' : 'Eliminar'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
