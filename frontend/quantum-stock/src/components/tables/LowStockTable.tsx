import {
	Chip,
	Progress,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@heroui/react';
import type React from 'react';
import { useCallback } from 'react';

type LowStockProduct = {
	id: number | string;
	name: string;
	category: string;
	currentStock: number;
	minStock: number;
	status: 'critical' | 'low' | 'normal';
};

type LowStockTableProps = {
	products: LowStockProduct[];
	maxHeight?: string;
};

const lowStockColumns = [
	{ name: 'Producto', uid: 'product' },
	{ name: 'Categoría', uid: 'category' },
	{ name: 'Stock Actual', uid: 'currentStock' },
	{ name: 'Stock Mínimo', uid: 'minStock' },
	{ name: 'Estado', uid: 'status' },
];

const categoryLabels: Record<string, string> = {
	ELECTRONICS: 'Electrónicos',
	CLOTHING: 'Ropa y Accesorios',
	HOME: 'Hogar y Jardín',
	HEALTH: 'Salud y Bienestar',
	TOYS: 'Juguetes',
	SPORTS: 'Deportes',
	BOOKS: 'Libros',
	FOOD: 'Alimentos y Bebidas',
	PET_SUPPLIES: 'Mascotas',
	AUTOMOTIVE: 'Automotriz',
	'Sin categoría': 'Sin categoría',
};

const getStatusColor = (status: string) => {
	switch (status) {
		case 'critical':
			return 'danger';
		case 'low':
			return 'warning';
		default:
			return 'success';
	}
};

const getStatusText = (status: string) => {
	switch (status) {
		case 'critical':
			return 'Crítico';
		case 'low':
			return 'Bajo';
		default:
			return 'Normal';
	}
};

const LowStockTable = ({
	products,
	maxHeight = '400px',
}: LowStockTableProps) => {
	const renderCell = useCallback((item: LowStockProduct, columnKey: string) => {
		switch (columnKey) {
			case 'product':
				return (
					<div className="flex flex-col">
						<p className="text-sm font-semibold text-default-700">
							{item.name}
						</p>
						<p className="text-xs text-default-400">ID: {item.id}</p>
					</div>
				);
			case 'category': {
				const label = categoryLabels[item.category] || item.category;
				return (
					<Chip variant="flat" size="sm" className="capitalize" color="primary">
						{label}
					</Chip>
				);
			}

			case 'currentStock': {
				const stockPercentage = (item.currentStock / item.minStock) * 100;
				return (
					<div className="flex flex-col gap-1">
						<span className="text-sm font-semibold text-default-700">
							{item.currentStock}
						</span>
						<Progress
							size="sm"
							value={stockPercentage}
							color={
								stockPercentage > 50
									? 'success'
									: stockPercentage > 30
										? 'warning'
										: 'danger'
							}
							className="w-28"
							radius="sm"
						/>
					</div>
				);
			}
			case 'minStock':
				return (
					<span className="text-sm font-medium text-default-600">
						{item.minStock}
					</span>
				);
			case 'status':
				return (
					<Chip size="sm" variant="flat" color={getStatusColor(item.status)}>
						{getStatusText(item.status)}
					</Chip>
				);
			default:
				return <></>;
		}
	}, []);

	const showScroll = products.length > 10;

	return (
		<div className="overflow-hidden border shadow-md rounded-xl bg-content1">
			<div
				className={`${showScroll ? 'overflow-auto' : ''}`}
				style={{ maxHeight: showScroll ? maxHeight : 'auto' }}
			>
				<Table
					aria-label="Tabla de productos con stock mínimo"
					removeWrapper={showScroll}
					classNames={{
						base: 'overflow-visible',
						table: showScroll ? 'min-w-full' : '',
					}}
				>
					<TableHeader columns={lowStockColumns}>
						{(column) => (
							<TableColumn
								key={column.uid}
								align="start"
								className="sticky top-0 z-10 text-sm font-semibold border-b bg-content2/70 backdrop-blur-md border-divider text-default-700"
							>
								{column.name}
							</TableColumn>
						)}
					</TableHeader>
					<TableBody
						items={products}
						emptyContent="No hay productos con stock bajo"
					>
						{(item) => (
							<TableRow
								key={item.id}
								className="transition-colors hover:bg-default-100 even:bg-default-50"
							>
								{(columnKey) => (
									<TableCell className="py-3">
										{renderCell(item, columnKey as string) as React.ReactNode}
									</TableCell>
								)}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{products.length > 0 && (
				<div className="px-4 py-2 text-sm border-t text-default-500 bg-content2">
					Mostrando{' '}
					<span className="font-semibold text-default-700">
						{products.length}
					</span>{' '}
					producto{products.length !== 1 ? 's' : ''} con stock bajo
				</div>
			)}
		</div>
	);
};

export default LowStockTable;
