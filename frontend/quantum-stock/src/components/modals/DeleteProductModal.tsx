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
import { useDeleteProduct } from '@/lib/hooks/useDeleteProduct';
import { useKeycloak } from '@react-keycloak/web';

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  onDelete?: (productId: string) => void; // Changed from onDeleteSuccess to match parent usage
}

export default function DeleteProductModal({
  isOpen,
  onClose,
  productId,
  productName,
  onDelete,
}: Readonly<DeleteProductModalProps>) {
  const [error, setError] = useState<string | null>(null);
  const { keycloak } = useKeycloak(); // Get user from auth context
  
	const isAdmin =
		keycloak.resourceAccess?.['quantum-stock-frontend']?.roles?.includes('admin') ||
		false; 
  const token = keycloak?.token ?? ''; // Adjust based on your auth implementation

  // Use the delete hook
  const { deleteProductById, isDeleting } = useDeleteProduct({
    isAdmin,
    token,
    onSuccess: (id) => {
      if (onDelete) {
        onDelete(id);
      }
      onClose();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleDelete = async () => {
    setError(null);
    await deleteProductById(productId);
  };

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