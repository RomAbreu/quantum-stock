'use client';

import DeleteProductModal from '@/components/modals/DeleteProductModal';
import EditProductModal from '@/components/modals/EditProductModal';
import { formatCategory } from '@/lib/utils/category.utils';
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
	useDisclosure,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import type React from 'react';
import { useCallback, useState } from 'react';

// Tipos para el stock actualizado
export type StockItem = {
	id: string;
	name: string;
	description: string;
	category: string;
	price: number;
	quantity: number;
	minQuantity: number;
};

// Columnas de la tabla actualizadas
export const stockColumns = [
	{ name: 'Nombre', uid: 'name' },
	{ name: 'Descripción', uid: 'description' },
	{ name: 'Categoría', uid: 'category' },
	{ name: 'Precio', uid: 'price' },
	{ name: 'Cantidad', uid: 'quantity' },
	{ name: 'Stock Mínimo', uid: 'minQuantity' },
	{ name: 'Acciones', uid: 'actions' },
];

type StockTableProps = {
	stockItems: StockItem[];
	onEdit: (id: string, updatedProduct: StockItem) => void;
	onDelete: (id: string) => void;
};

export default function StockTable({
	stockItems,
	onEdit,
	onDelete,
}: Readonly<StockTableProps>) {
	// Estado para manejar el modal de eliminación
	const deleteModal = useDisclosure();
	const [productToDelete, setProductToDelete] = useState<StockItem | null>(
		null,
	);

	// Estado para manejar el modal de edición
	const editModal = useDisclosure();
	const [productToEdit, setProductToEdit] = useState<StockItem | null>(null);

	// Función para abrir el modal de eliminación
	const handleOpenDeleteModal = (item: StockItem) => {
		setProductToDelete(item);
		deleteModal.onOpen();
	};

	// Función para abrir el modal de edición
	const handleOpenEditModal = (item: StockItem) => {
		setProductToEdit(item);
		editModal.onOpen();
	};

	// Función para manejar la eliminación desde el modal
	const handleConfirmDelete = async (id: string) => {
		try {
			onDelete(id);
			deleteModal.onClose();
		} catch (error) {
			console.error('Error al eliminar el producto:', error);
		}
	};

	// Función para manejar la edición desde el modal
	const handleSaveEdit = async (updatedProduct: StockItem) => {
		try {
			// Llamar a la función onEdit del componente padre que realizará la actualización y el refetch
			onEdit(updatedProduct.id, updatedProduct);

			// Cerrar el modal después de una actualización exitosa
			editModal.onClose();
		} catch (error) {
			console.error('Error al actualizar el producto:', error);
			// El modal permanecerá abierto si hay un error, permitiendo al usuario reintentar
		}
	};

	const getQuantityColor = (quantity: number, minQuantity: number) => {
		if (quantity === 0) return 'danger';
		if (quantity <= minQuantity) return 'warning';
		return 'success';
	};

	const renderCell = useCallback((item: StockItem, columnKey: string) => {
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
						{formatCategory(item.category)}
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
						color={getQuantityColor(item.quantity, item.minQuantity)}
						size="sm"
					>
						{item.quantity}
					</Chip>
				);
			case 'minQuantity':
				return <span className="text-sm text-warning">{item.minQuantity}</span>;
			case 'actions':
				return (
					<div className="flex items-center justify-center gap-1 w-full min-w-[100px]">
						<Tooltip content="Editar">
							<Button
								isIconOnly
								size="sm"
								variant="light"
								onPress={() => handleOpenEditModal(item)}
								className="min-w-8 h-8"
							>
								<Icon icon="lucide:edit" className="text-base" />
							</Button>
						</Tooltip>
						<Tooltip content="Eliminar" color="danger">
							<Button
								isIconOnly
								size="sm"
								variant="light"
								color="danger"
								onPress={() => handleOpenDeleteModal(item)}
								className="min-w-8 h-8"
							>
								<Icon icon="lucide:trash-2" className="text-base" />
							</Button>
						</Tooltip>
					</div>
				);
			default:
				return <></>;
		}
	}, []);

	return (
		<>
			<div className="border rounded-lg bg-content1">
				<Table aria-label="Stock table">
					<TableHeader columns={stockColumns}>
						{(column) => (
							<TableColumn
								key={column.uid}
								align={column.uid === 'actions' ? 'center' : 'start'}
								width={column.uid === 'actions' ? 120 : undefined}
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
									<TableCell
										className={
											columnKey === 'actions' ? 'text-center w-[120px]' : ''
										}
									>
										{renderCell(item, columnKey as string) as React.ReactNode}
									</TableCell>
								)}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Modal de confirmación de eliminación (ahora fuera del map) */}
			<DeleteProductModal
				isOpen={deleteModal.isOpen}
				onClose={deleteModal.onClose}
				productId={productToDelete?.id ?? ''}
				productName={productToDelete?.name ?? ''}
				onDelete={handleConfirmDelete}
			/>

			{/* Modal de edición de producto (ahora fuera del map) */}
			<EditProductModal
				isOpen={editModal.isOpen}
				onClose={editModal.onClose}
				product={
					productToEdit || {
						id: '',
						name: '',
						description: '',
						category: '',
						price: 0,
						quantity: 0,
						minQuantity: 0,
					}
				}
				onSave={handleSaveEdit}
			/>
		</>
	);
}
