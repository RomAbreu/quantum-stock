'use client';

import EditProductForm, {
	type EditProductData,
} from '@/components/forms/EditProductForm';
import type Product from '@/lib/model/product.model';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';

type EditProductModalProps = {
	isOpen: boolean;
	onClose: () => void;
	product: Product;
	onSave: (product: EditProductData) => Promise<void>;
};

export default function EditProductModal({
	isOpen,
	onClose,
	product,
	onSave,
}: Readonly<EditProductModalProps>) {
	const [isLoading, setIsLoading] = useState(false);

	const handleSave = async (productData: EditProductData) => {
		try {
			setIsLoading(true);
			await onSave(productData);
			onClose();
		} catch (error) {
			console.error('Error saving product:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<Icon icon="lucide:edit-3" className="text-primary" />
						<h2>Editar Producto</h2>
					</div>
					<p className="text-sm text-default-500">
						Actualiza la información del producto
					</p>
				</ModalHeader>
				<ModalBody>
					<EditProductForm
						product={product}
						onSave={handleSave}
						onCancel={onClose}
						isLoading={isLoading}
					/>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
