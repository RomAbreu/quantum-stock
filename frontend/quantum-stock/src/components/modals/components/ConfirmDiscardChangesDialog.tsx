import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react';
import { Icon } from '@iconify/react';

type ConfirmDiscardChangesDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
};

export default function ConfirmDiscardChangesDialog({
	isOpen,
	onClose,
	onConfirm,
}: Readonly<ConfirmDiscardChangesDialogProps>) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} size="sm" placement="center">
			<ModalContent>
				<ModalHeader className="flex gap-2">
					<Icon icon="lucide:alert-triangle" className="text-warning" />
					<span>¿Descartar cambios?</span>
				</ModalHeader>
				<ModalBody>
					<p>
						Tienes cambios no guardados. Si cierras ahora, perderás todos los
						cambios realizados.
					</p>
				</ModalBody>
				<ModalFooter>
					<Button variant="flat" onPress={onClose}>
						Cancelar
					</Button>
					<Button color="danger" onPress={onConfirm}>
						Descartar cambios
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
