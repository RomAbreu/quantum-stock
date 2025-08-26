'use client';

import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';

import AddProductForm from '@/components/forms/AddProductForm';
import ModalCloseButton from '@/components/modals/components/ModalCloseButton';
import type Product from '@/lib/model/product.model';

type AddProductModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Product) => Promise<void>;
};

export default function AddProductModal({
    isOpen,
    onClose,
    onSave,
}: Readonly<AddProductModalProps>) {
    const [savingProduct, setSavingProduct] = useState(false);

    const handleClose = () => {
        onClose();
    };

    const handleSave = async (product: Product) => {
        try {
            setSavingProduct(true);
            await onSave(product);
            handleClose();
        } catch (error) {
            console.error('Error saving product:', error);
        } finally {
            setSavingProduct(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="3xl"
            scrollBehavior="inside"
            hideCloseButton
            isDismissable={!savingProduct}
            isKeyboardDismissDisabled={savingProduct}
        >
            <ModalContent>
                <ModalCloseButton
                    onClose={handleClose}
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
                    <p className="text-sm text-default-500">
                        Completa la información para agregar un nuevo producto al
                        inventario
                    </p>
                </ModalHeader>

                <ModalBody className="pb-6">
                    <AddProductForm
                        onSave={handleSave}
                        onCancel={handleClose}
                        isLoading={savingProduct}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}