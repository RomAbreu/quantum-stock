'use client';

import {
	Button,
	Card,
	CardBody,
	Chip,
	Input,
	Select,
	SelectItem,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';

import BreadcrumbsBuilder, {
	type BreadCrumbNavigationItem,
} from '@/components/breadcrumbsBuilder/BreadCrumbsBuilder';
import StatsCards from '@/components/cards/StatsCard';
import type { NewProductData } from '@/components/forms/AddProductForm';
import AddProductModal from '@/components/modals/AddProductModal';
import StockTable, { type StockItem } from '@/components/tables/StockTable';

const mockStockData: StockItem[] = [
	{
		id: '1',
		name: 'Laptop Dell XPS 13',
		description:
			'Laptop ultradelgada de 13 pulgadas con procesador Intel i7, 16GB RAM y 512GB SSD',
		category: 'Electrónicos',
		price: 1299.99,
		quantity: 15,
		minimumStock: 5,
	},
	{
		id: '2',
		name: 'Mouse Logitech MX Master',
		description:
			'Mouse inalámbrico ergonómico con tecnología MX para productividad avanzada',
		category: 'Accesorios',
		price: 99.99,
		quantity: 3,
		minimumStock: 10,
	},
	{
		id: '3',
		name: 'Teclado Mecánico RGB',
		description:
			'Teclado mecánico gaming con switches Cherry MX y retroiluminación RGB personalizable',
		category: 'Accesorios',
		price: 149.99,
		quantity: 0,
		minimumStock: 2,
	},
	{
		id: '4',
		name: 'Monitor 4K Samsung',
		description:
			'Monitor de 27 pulgadas con resolución 4K UHD, ideal para diseño y gaming',
		category: 'Monitores',
		price: 399.99,
		quantity: 8,
		minimumStock: 3,
	},
	{
		id: '5',
		name: 'Webcam HD Logitech',
		description:
			'Cámara web Full HD 1080p con micrófono integrado para videoconferencias',
		category: 'Accesorios',
		price: 79.99,
		quantity: 12,
		minimumStock: 5,
	},
];

// Breadcrumbs items
const breadcrumbItems: BreadCrumbNavigationItem[] = [
	{ name: 'Inicio', href: '/' },
	{ name: 'Inventario', href: '/stock' },
];

export default function StockPage() {
	const [stockItems, setStockItems] = useState<StockItem[]>(mockStockData);
	const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
	const [searchTerm, setSearchTerm] = useState('');
	const [filterCategory, setFilterCategory] = useState<string>('all');
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	const handleEdit = (id: string) => {
		console.log('Edit item:', id);
		// Aquí iría la lógica para editar
	};

	const handleDelete = (id: string) => {
		console.log('Delete item:', id);
		// Aquí iría la lógica para eliminar
		setStockItems((prev) => prev.filter((item) => item.id !== id));
	};

	const handleAddNew = () => {
		setIsAddModalOpen(true);
	};

	const handleSaveProduct = async (
		productData: NewProductData,
	): Promise<void> => {
		const newProduct: StockItem = {
			id: (stockItems.length + 1).toString(),
			name: productData.name,
			description: productData.description,
			category: productData.category,
			price: productData.price,
			quantity: productData.initialQuantity,
			minimumStock: productData.minimumStock,
		};

		// Simular delay de API
		await new Promise((resolve) => setTimeout(resolve, 1000));

		setStockItems((prev) => [...prev, newProduct]);
		console.log('Product saved:', newProduct);
	};

	const filteredItems = stockItems.filter((item) => {
		const matchesSearch =
			item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory =
			filterCategory === 'all' || item.category === filterCategory;
		return matchesSearch && matchesCategory;
	});

	const categories = Array.from(
		new Set(stockItems.map((item) => item.category)),
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-content1">
			{/* Floating Header with Glass Effect */}
			<div className="sticky top-0 z-10">
				<div className="border-b backdrop-blur-xl bg-background/70 border-divider/20">
					<div className="container px-4 py-4 mx-auto">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-xl bg-primary/10">
									<Icon
										icon="lucide:package"
										className="text-2xl text-primary"
									/>
								</div>
								<div>
									<h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
										Quantum Inventory
									</h1>
									<p className="text-sm text-default-500">
										Gestión inteligente de stock
									</p>
								</div>
							</div>
							<Button
								color="primary"
								size="lg"
								className="transition-all duration-300 shadow-lg bg-[#014CA5] hover:shadow-xl"
								startContent={<Icon icon="lucide:plus" />}
								onPress={handleAddNew}
							>
								Nuevo Artículo
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container px-4 py-6 mx-auto">
				{/* Breadcrumbs with Animation */}
				<div className="mb-8 animate-fade-in-up">
					<BreadcrumbsBuilder items={breadcrumbItems} />
				</div>

				{/* Enhanced Stats Cards */}
				<div className="mb-8 animate-fade-in-up animation-delay-200">
					<StatsCards stockItems={stockItems} />
				</div>

				{/* Control Panel */}
				<Card className="mb-6 shadow-lg animate-fade-in-up animation-delay-300">
					<CardBody className="p-6">
						<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
							{/* Search and Filters */}
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
								<Input
									className="w-full sm:w-80"
									placeholder="Buscar por nombre o descripción..."
									startContent={
										<Icon icon="lucide:search" className="text-default-400" />
									}
									value={searchTerm}
									onValueChange={setSearchTerm}
									variant="bordered"
								/>
								<Select
									className="w-full sm:w-48"
									placeholder="Filtrar por categoría"
									selectedKeys={[filterCategory]}
									onSelectionChange={(keys) =>
										setFilterCategory(Array.from(keys)[0] as string)
									}
									variant="bordered"
								>
									<SelectItem key="all">Todas las categorías</SelectItem>
									<>
										{categories.map((category) => (
											<SelectItem key={category}>{category}</SelectItem>
										))}
									</>
								</Select>
							</div>

							{/* View Mode Toggle */}
							<div className="flex items-center gap-2">
								<Chip variant="flat" size="sm">
									{filteredItems.length} resultados
								</Chip>
								<div className="flex gap-1 p-1 rounded-lg bg-default-100">
									<Button
										isIconOnly
										size="sm"
										variant={viewMode === 'table' ? 'solid' : 'light'}
										color={viewMode === 'table' ? 'primary' : 'default'}
										onPress={() => setViewMode('table')}
									>
										<Icon icon="lucide:table" />
									</Button>
									<Button
										isIconOnly
										size="sm"
										variant={viewMode === 'cards' ? 'solid' : 'light'}
										color={viewMode === 'cards' ? 'primary' : 'default'}
										onPress={() => setViewMode('cards')}
									>
										<Icon icon="lucide:grid-3x3" />
									</Button>
								</div>
							</div>
						</div>
					</CardBody>
				</Card>

				{/* Dynamic Content based on view mode */}
				<div className="animate-fade-in-up animation-delay-400">
					{viewMode === 'table' ? (
						<StockTable
							stockItems={filteredItems}
							onEdit={handleEdit}
							onDelete={handleDelete}
						/>
					) : (
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{filteredItems.map((item) => (
								<Card
									key={item.id}
									className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
								>
									<CardBody className="p-4">
										<div className="flex items-start justify-between mb-3">
											<Chip variant="bordered" size="sm" color="primary">
												{item.category}
											</Chip>
											<Chip
												color={
													item.quantity === 0
														? 'danger'
														: item.quantity <= item.minimumStock
															? 'warning'
															: 'success'
												}
												variant="dot"
												size="sm"
											/>
										</div>
										<h4 className="mb-2 text-lg font-semibold line-clamp-2">
											{item.name}
										</h4>
										<p className="mb-3 text-sm text-default-500 line-clamp-2">
											{item.description}
										</p>
										<div className="mb-4 space-y-2">
											<div className="flex justify-between text-sm">
												<span className="text-default-500">Precio:</span>
												<span className="font-semibold text-success">
													${item.price.toFixed(2)}
												</span>
											</div>
											<div className="flex justify-between text-sm">
												<span className="text-default-500">Cantidad:</span>
												<span
													className={`font-semibold ${
														item.quantity === 0
															? 'text-danger'
															: item.quantity <= item.minimumStock
																? 'text-warning'
																: 'text-success'
													}`}
												>
													{item.quantity}
												</span>
											</div>
											<div className="flex justify-between text-sm">
												<span className="text-default-500">Stock Mínimo:</span>
												<span className="text-warning">
													{item.minimumStock}
												</span>
											</div>
										</div>
										<div className="flex gap-2">
											<Button
												size="sm"
												variant="light"
												startContent={<Icon icon="lucide:edit" />}
												onPress={() => handleEdit(item.id)}
												className="flex-1"
											>
												Editar
											</Button>
											<Button
												size="sm"
												variant="light"
												color="danger"
												isIconOnly
												onPress={() => handleDelete(item.id)}
											>
												<Icon icon="lucide:trash-2" />
											</Button>
										</div>
									</CardBody>
								</Card>
							))}
						</div>
					)}
				</div>

				{/* Empty State */}
				{filteredItems.length === 0 && (
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<div className="p-4 mb-4 rounded-full bg-default-100">
							<Icon
								icon="lucide:package-x"
								className="text-4xl text-default-400"
							/>
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
							onPress={handleAddNew}
						>
							Agregar Primer Producto
						</Button>
					</div>
				)}
			</div>

			{/* Floating Action Button for Mobile */}
			<div className="fixed bottom-6 right-6 lg:hidden">
				<Button
					isIconOnly
					color="primary"
					size="lg"
					className="shadow-2xl w-14 h-14 bg-gradient-to-r from-primary to-secondary"
					onPress={handleAddNew}
				>
					<Icon icon="lucide:plus" className="text-xl" />
				</Button>
			</div>

			{/* Add Product Modal */}
			<AddProductModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onSave={handleSaveProduct}
				categories={categories}
			/>
		</div>
	);
}
