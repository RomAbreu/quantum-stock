'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

type FormActionsProps = {
	onCancel: () => void;
	isLoading: boolean;
	submitting: boolean;
	isPending: boolean;
	isFormValid: boolean;
};

export default function FormActions({
	onCancel,
	isLoading,
	submitting,
	isPending,
	isFormValid,
}: Readonly<FormActionsProps>) {
	const isButtonDisabled = isLoading || submitting || isPending;

	return (
		<div className="flex justify-end gap-3 pt-4">
			<Button
				color="danger"
				variant="solid"
				onPress={onCancel}
				disabled={isButtonDisabled}
				type="button"
			>
				Cancelar
			</Button>
			<Button
				color="primary"
				type="submit"
				isLoading={isButtonDisabled}
				isDisabled={!isFormValid || isButtonDisabled}
				startContent={!isButtonDisabled ? <Icon icon="lucide:save" /> : null}
			>
				{isButtonDisabled ? 'Guardando...' : 'Guardar Producto'}
			</Button>
		</div>
	);
}
