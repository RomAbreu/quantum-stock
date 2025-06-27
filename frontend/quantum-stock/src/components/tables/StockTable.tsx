'use client';

import {
	Button,
	Chip,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import type React from 'react';
import { useCallback } from 'react';

// Tipos para el stock actualizado
export type StockItem = {
	id: string;
	name: string;
	description: string;
	category: string;
	price: number;
	quantity: number;
	minimumStock: number;
};

// Columnas de la tabla actualizadas
export const stockColumns = [
	{ name: 'Nombre', uid: 'name' },
	{ name: 'Descripción', uid: 'description' },
	{ name: 'Categoría', uid: 'category' },
	{ name: 'Precio', uid: 'price' },
	{ name: 'Cantidad', uid: 'quantity' },
	{ name: 'Stock Mínimo', uid: 'minimumStock' },
	{ name: 'Acciones', uid: 'actions' },
];

type StockTableProps = {
	stockItems: StockItem[];
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
};

export default function StockTable({
	stockItems,
	onEdit,
	onDelete,
}: Readonly<StockTableProps>) {
	const getQuantityColor = (quantity: number, minimumStock: number) => {
		if (quantity === 0) return 'danger';
		if (quantity <= minimumStock) return 'warning';
		return 'success';
	};

	const renderCell = useCallback(
		(item: StockItem, columnKey: string) => {
			switch (columnKey) {
				case 'name':
					return (
						<div className="flex flex-col">
							<p className="text-sm font-semibold">{item.name}</p>
						</div>
					);
				case 'description':
					return (
						<div className="max-w-xs">
							<p className="text-sm text-default-600 line-clamp-2">
								{item.description}
							</p>
						</div>
					);
				case 'category':
					return (
						<Chip variant="flat" size="sm" color="primary">
							{item.category}
						</Chip>
					);
				case 'price':
					return (
						<span className="text-sm font-semibold text-success">
							${item.price.toFixed(2)}
						</span>
					);
				case 'quantity':
					return (
						<Chip
							variant="dot"
							color={getQuantityColor(item.quantity, item.minimumStock)}
							size="sm"
						>
							{item.quantity}
						</Chip>
					);
				case 'minimumStock':
					return (
						<span className="text-sm text-warning">{item.minimumStock}</span>
					);
				case 'actions':
					return (
						<div className="relative flex items-center gap-2">
							<Tooltip content="Editar">
								<Button
									isIconOnly
									size="sm"
									variant="light"
									onPress={() => onEdit(item.id)}
								>
									<Icon icon="lucide:edit" className="text-lg" />
								</Button>
							</Tooltip>
							<Tooltip content="Eliminar" color="danger">
								<Button
									isIconOnly
									size="sm"
									variant="light"
									color="danger"
									onPress={() => onDelete(item.id)}
								>
									<Icon icon="lucide:trash-2" className="text-lg" />
								</Button>
							</Tooltip>
						</div>
					);
				default:
					return <></>;
			}
		},
		[onEdit, onDelete],
	);

	return (
		<div className="border rounded-lg bg-content1">
			<Table aria-label="Stock table">
				<TableHeader columns={stockColumns}>
					{(column) => (
						<TableColumn
							key={column.uid}
							align={column.uid === 'actions' ? 'center' : 'start'}
						>
							<Chip variant="bordered">
								<span className="font-bold">{column.name}</span>
							</Chip>
						</TableColumn>
					)}
				</TableHeader>
				<TableBody items={stockItems}>
					{(item) => (
						<TableRow key={item.id}>
							{(columnKey) => (
								<TableCell>
									{renderCell(item, columnKey as string) as React.ReactNode}
								</TableCell>
							)}
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
