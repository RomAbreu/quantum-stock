'use client';

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	useDisclosure,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';

import AddProductForm from '@/components/forms/AddProductForm';
import type { NewProductData } from '@/components/forms/types/product.types';
import ConfirmDiscardChangesDialog from '@/components/modals/components/ConfirmDiscardChangesDialog';
import ModalCloseButton from '@/components/modals/components/ModalCloseButton';

type AddProductModalProps = {
	isOpen?: boolean;
	onClose: () => void;
	onSave?: (product: NewProductData) => Promise<void>;
	triggerButton?: React.ReactNode;
	hideFooter?: boolean;
	isProcessing?: boolean;
};

export default function AddProductModal({
	isOpen: externalIsOpen,
	onClose,
	onSave,
	triggerButton,
	hideFooter = true,
	isProcessing = false,
}: Readonly<AddProductModalProps>) {
	// Estados locales
	const [hasChanges, setHasChanges] = useState(false);
	const [showDiscardDialog, setShowDiscardDialog] = useState(false);
	const [savingProduct, setSavingProduct] = useState(false);

	// Control del modal: uso interno o externo
	const disclosure = useDisclosure();
	const isControlled = externalIsOpen !== undefined;
	const isOpen = isControlled ? externalIsOpen : disclosure.isOpen;

	// Manejadores
	const handleOpen = () => {
		if (!isControlled) {
			disclosure.onOpen();
		}
		setHasChanges(false);
	};

	const handleCloseRequest = () => {
		if (hasChanges && !savingProduct) {
			// Mostrar diálogo de confirmación si hay cambios no guardados
			setShowDiscardDialog(true);
		} else {
			handleClose();
		}
	};

	const handleClose = () => {
		setShowDiscardDialog(false);
		if (isControlled) {
			onClose();
		} else {
			disclosure.onClose();
		}
		setHasChanges(false);
	};

	const handleSave = async (product: NewProductData) => {
		try {
			setSavingProduct(true);
			if (onSave) {
				await onSave(product);
			}
			setHasChanges(false);
			handleClose();
		} catch (error) {
			console.error('Error saving product:', error);
			// El error se maneja en el formulario
		} finally {
			setSavingProduct(false);
		}
	};

	const handleFormChange = () => {
		if (!hasChanges) {
			setHasChanges(true);
		}
	};

	// Botón para abrir el modal
	const defaultTriggerButton = (
		<Button
			color="primary"
			startContent={<Icon icon="lucide:plus" />}
			onPress={handleOpen}
			isDisabled={isProcessing}
		>
			Nuevo Producto
		</Button>
	);

	return (
		<>
			{!isControlled && (triggerButton || defaultTriggerButton)}

			<Modal
				isOpen={isOpen}
				onClose={handleCloseRequest}
				size="3xl"
				scrollBehavior="inside"
				hideCloseButton
				isDismissable={!hasChanges || savingProduct}
				isKeyboardDismissDisabled={hasChanges && !savingProduct}
			>
				<ModalContent>
					<ModalCloseButton
						onClose={handleCloseRequest}
						disabled={savingProduct}
					/>

					<ModalHeader className="flex flex-col gap-1">
						<div className="flex items-center gap-2">
							<div className="p-1 rounded-md bg-primary/10">
								<Icon
									icon="lucide:package-plus"
									className="text-xl text-primary"
								/>
							</div>
							<h2 className="text-xl font-semibold">Nuevo Producto</h2>
						</div>
						<p className="text-sm font-normal text-default-500">
							Completa la información para agregar un nuevo producto al
							inventario
						</p>
					</ModalHeader>

					<ModalBody className="pb-6">
						<AddProductForm
							onSave={handleSave}
							onCancel={handleCloseRequest}
							isLoading={savingProduct || isProcessing}
							onChange={handleFormChange}
						/>
					</ModalBody>
				</ModalContent>
			</Modal>

			{/* Diálogo de confirmación para descartar cambios */}
			<ConfirmDiscardChangesDialog
				isOpen={showDiscardDialog}
				onClose={() => setShowDiscardDialog(false)}
				onConfirm={handleClose}
			/>
		</>
	);
}
