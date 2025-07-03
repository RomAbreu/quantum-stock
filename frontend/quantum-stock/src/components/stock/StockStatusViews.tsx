'use client';

import { Button, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';

type LoadingViewProps = {
	message?: string;
};

export function LoadingView({
	message = 'Cargando productos...',
}: Readonly<LoadingViewProps>) {
	return (
		<div className="flex flex-col items-center justify-center py-16">
			<div className="p-4 mb-4 rounded-full bg-primary/10">
				<Icon
					icon="lucide:loader"
					className="text-4xl text-primary animate-spin"
				/>
			</div>
			<h3 className="text-xl font-semibold">{message}</h3>
		</div>
	);
}

type ErrorViewProps = {
	error: string;
};

export function ErrorView({ error }: Readonly<ErrorViewProps>) {
	return (
		<Card className="mb-6 border-danger">
			<CardBody>
				<div className="flex items-center gap-2 text-danger">
					<Icon icon="lucide:alert-triangle" />
					<p>{error}</p>
				</div>
			</CardBody>
		</Card>
	);
}

type EmptyStateViewProps = {
	onAddProduct: () => void;
};

export function EmptyStateView({
	onAddProduct,
}: Readonly<EmptyStateViewProps>) {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="p-4 mb-4 rounded-full bg-default-100">
				<Icon icon="lucide:package-x" className="text-4xl text-default-400" />
			</div>
			<h3 className="mb-2 text-xl font-semibold">
				No se encontraron productos
			</h3>
			<p className="mb-4 text-default-500">
				Intenta ajustar los filtros o agrega nuevos productos
			</p>
			<Button
				color="primary"
				startContent={<Icon icon="lucide:plus" />}
				onPress={onAddProduct}
			>
				Agregar Primer Producto
			</Button>
		</div>
	);
}
