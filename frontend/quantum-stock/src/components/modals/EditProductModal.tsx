'use client';

import EditProductForm, {
  type EditProductData,
} from '@/components/forms/EditProductForm';
import type Product from '@/lib/model/product.model';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';
import { Icon } from '@iconify/react';

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
            onSave={onSave}
            onCancel={onClose}
            isLoading={false}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
