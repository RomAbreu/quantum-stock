'use client';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';

import AddProductForm from '@/components/forms/AddProductForm';
import type Product from '@/lib/model/product.model';
import ConfirmDiscardChangesDialog from '@/components/modals/components/ConfirmDiscardChangesDialog';
import ModalCloseButton from '@/components/modals/components/ModalCloseButton';

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
  const [hasChanges, setHasChanges] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  const handleCloseRequest = () => {
    if (hasChanges && !savingProduct) {
      setShowDiscardDialog(true);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setShowDiscardDialog(false);
    onClose();
    setHasChanges(false);
  };

  const handleSave = async (product: Product) => {
    try {
      setSavingProduct(true);
      await onSave(product);
      setHasChanges(false);
      handleClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleFormChange = () => {
    if (!hasChanges) {
      setHasChanges(true);
    }
  };

  return (
    <>
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
                <Icon icon="lucide:package-plus" className="text-xl text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Nuevo Producto</h2>
            </div>
            <p className="text-sm text-default-500">
              Completa la información para agregar un nuevo producto al inventario
            </p>
          </ModalHeader>

          <ModalBody className="pb-6">
            <AddProductForm
              onSave={handleSave}
              onCancel={handleCloseRequest}
              isLoading={savingProduct}
              onChange={handleFormChange}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <ConfirmDiscardChangesDialog
        isOpen={showDiscardDialog}
        onClose={() => setShowDiscardDialog(false)}
        onConfirm={handleClose}
      />
    </>
  );
}