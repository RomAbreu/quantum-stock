'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

type FloatingActionButtonProps = {
	onPress: () => void;
	isDisabled?: boolean;
};

export default function FloatingActionButton({
	onPress,
	isDisabled = false,
}: Readonly<FloatingActionButtonProps>) {
	return (
		<div className="fixed bottom-6 right-6 lg:hidden">
			<Button
				isIconOnly
				color="primary"
				size="lg"
				className="shadow-2xl w-14 h-14 bg-gradient-to-r from-primary to-secondary"
				onPress={onPress}
				isDisabled={isDisabled}
			>
				<Icon icon="lucide:plus" className="text-xl" />
			</Button>
		</div>
	);
}
