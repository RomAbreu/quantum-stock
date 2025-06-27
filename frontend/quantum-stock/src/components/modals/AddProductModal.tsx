'use client';

import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';

import AddProductForm, {
	type NewProductData,
} from '@/components/forms/AddProductForm';

type AddProductModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onSave: (product: NewProductData) => Promise<void>;
	categories: string[];
};

export default function AddProductModal({
	isOpen,
	onClose,
	onSave,
	categories,
}: Readonly<AddProductModalProps>) {
	const [isLoading, setIsLoading] = useState(false);

	const handleSave = async (productData: NewProductData) => {
		setIsLoading(true);
		try {
			await onSave(productData);
			onClose();
		} catch (error) {
			console.error('Error saving product:', error);
			throw error; // Re-throw para que el form pueda manejar el error
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="2xl"
			classNames={{
				backdrop:
					'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
				base: 'border border-divider/20 bg-background/95 backdrop-blur-xl',
				header: 'border-b border-divider/20',
				closeButton: 'hover:bg-white/5 active:bg-white/10',
			}}
			isDismissable={!isLoading}
			hideCloseButton={isLoading}
		>
			<ModalContent>
				<ModalHeader className="flex items-center gap-3">
					<div className="p-2 rounded-lg bg-primary/10">
						<Icon icon="lucide:package-plus" className="text-xl text-primary" />
					</div>
					<div>
						<h2 className="text-xl font-bold">Agregar Nuevo Producto</h2>
						<p className="text-sm text-default-500">
							Complete la información del producto
						</p>
					</div>
				</ModalHeader>

				<ModalBody className="pb-6">
					<AddProductForm
						onSave={handleSave}
						onCancel={onClose}
						categories={categories}
						isLoading={isLoading}
					/>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
