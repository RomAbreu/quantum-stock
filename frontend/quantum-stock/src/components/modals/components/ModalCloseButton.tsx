import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

type ModalCloseButtonProps = {
	onClose: () => void;
	disabled?: boolean;
};

export default function ModalCloseButton({
	onClose,
	disabled = false,
}: Readonly<ModalCloseButtonProps>) {
	return (
		<Button
			isIconOnly
			variant="light"
			className="absolute z-10 right-2 top-2"
			onPress={onClose}
			isDisabled={disabled}
		>
			<Icon icon="lucide:x" className="text-default-400" />
		</Button>
	);
}
