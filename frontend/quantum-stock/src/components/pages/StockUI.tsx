'use client';

import { useDisclosure } from '@heroui/react';
import { useKeycloak } from '@react-keycloak/web';
import { useEffect, useState } from 'react';

import BreadcrumbsBuilder, {
	type BreadCrumbNavigationItem,
} from '@/components/breadcrumbsBuilder/BreadCrumbsBuilder';
import StatsCards from '@/components/cards/StatsCard';
import type { NewProductData } from '@/components/forms/AddProductForm';
import AddProductModal from '@/components/modals/AddProductModal';
import StockTable, { type StockItem } from '@/components/tables/StockTable';
import { deleteProduct } from '@/lib/actions/product.action';
import { getProducts } from '@/lib/data/fetch/product.fetch';
import type Product from '@/lib/entity/product.entity';

import ControlPanel from '@/components/stock/ControlPanel';
import FloatingActionButton from '@/components/stock/FloatingActionButton';
import ProductCardsView from '@/components/stock/ProductCardsView';
// Componentes modularizados
import StockHeader from '@/components/stock/StockHeader';
import {
	EmptyStateView,
	ErrorView,
	LoadingView,
} from '@/components/stock/StockStatusViews';

// Hook personalizado para filtrado
import useStockFilter from '../../lib/hooks/useStockFilter';

// Breadcrumbs items
const breadcrumbItems: BreadCrumbNavigationItem[] = [
	{ name: 'Inicio', href: '/' },
	{ name: 'Inventario', href: '/stock' },
];

export default function StockUI() {
	const [stockItems, setStockItems] = useState<StockItem[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
	const [deleteError, setDeleteError] = useState<string | null>(null);

	const { keycloak: Keycloak } = useKeycloak();
	const user = { token: Keycloak?.token };

	const {
		isOpen: isAddModalOpen,
		onOpen: onOpenAddModal,
		onClose: onCloseAddModal,
	} = useDisclosure();

	// Usar nuestro hook personalizado para filtrado
	const {
		searchTerm,
		setSearchTerm,
		filterCategory,
		setFilterCategory,
		filteredItems,
		categories,
	} = useStockFilter(stockItems);

	// Fetch products from the API
	const fetchProducts = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const token = user.token;

			if (!token) {
				throw new Error('No estás autenticado');
			}

			const productsData = await getProducts(token);

			if (productsData instanceof Error) {
				throw productsData;
			}

			// Transform API data to StockItem format
			const transformedData: StockItem[] = productsData.map(
				(product: Product) => ({
					id: product.id,
					name: product.name,
					description: product.description,
					category: product.category,
					price: product.price,
					quantity: product.quantity,
					minQuantity: product.minQuantity ?? 0,
				}),
			);

			setStockItems(transformedData);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Error al cargar los productos',
			);
		} finally {
			setIsLoading(false);
		}
	};

	// Fetch products on component mount
	useEffect(() => {
		fetchProducts();
	}, []);

	const handleEdit = async (id: string, updatedProduct: StockItem) => {
		try {
			// Actualizar la lista de productos localmente para una experiencia más responsiva
			setStockItems((prev) =>
				prev.map((item) => (item.id === id ? updatedProduct : item)),
			);

			// Hacer un refetch de los productos para asegurar sincronización con el backend
			await fetchProducts();
		} catch (err) {
			console.error('Error al actualizar:', err);
			// En caso de error, hacer refetch para restaurar el estado correcto
			await fetchProducts();
		}
	};

	const handleDelete = async (id: string) => {
		setDeleteError(null);
		try {
			const token = user.token;

			if (!token) {
				throw new Error('No estás autenticado');
			}

			const result = await deleteProduct(null, { id, token });

			if (result.errors?.deleteProduct) {
				throw new Error(result.errors.deleteProduct);
			}

			// Actualizar la lista de productos localmente para una experiencia más responsiva
			setStockItems((prev) => prev.filter((item) => item.id !== id));

			// Hacer un refetch de los productos para asegurar sincronización con el backend
			await fetchProducts();
		} catch (err) {
			setDeleteError(
				err instanceof Error ? err.message : 'Error al eliminar el producto',
			);
			console.error('Error al eliminar:', err);
		}
	};

	const handleSaveProduct = async (
		productData: NewProductData,
	): Promise<void> => {
		// After successful save through the form, refresh products
		await fetchProducts();
		onCloseAddModal(); // Close modal after save
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-content1">
			{/* Header */}
			<StockHeader onAddProduct={onOpenAddModal} isLoading={isLoading} />

			{/* Main Content */}
			<div className="container px-4 py-6 mx-auto">
				{/* Breadcrumbs */}
				<div className="mb-8 animate-fade-in-up">
					<BreadcrumbsBuilder items={breadcrumbItems} />
				</div>

				{/* Stats Cards */}
				<div className="mb-8 animate-fade-in-up animation-delay-200">
					<StatsCards stockItems={stockItems} />
				</div>

				{/* Control Panel */}
				<ControlPanel
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					filterCategory={filterCategory}
					setFilterCategory={setFilterCategory}
					categories={categories}
					viewMode={viewMode}
					setViewMode={setViewMode}
					onRefresh={fetchProducts}
					isLoading={isLoading}
					filteredItemsCount={filteredItems.length}
				/>

				{/* Error State */}
				{error && <ErrorView error={error} />}
				{deleteError && <ErrorView error={deleteError} />}

				{/* Loading State */}
				{isLoading ? (
					<LoadingView />
				) : (
					<div className="animate-fade-in-up animation-delay-400">
						{filteredItems.length > 0 ? (
							viewMode === 'table' ? (
								<StockTable
									stockItems={filteredItems}
									onEdit={handleEdit}
									onDelete={handleDelete}
								/>
							) : (
								<ProductCardsView
									items={filteredItems}
									onEdit={handleEdit}
									onDelete={handleDelete}
								/>
							)
						) : (
							<EmptyStateView onAddProduct={onOpenAddModal} />
						)}
					</div>
				)}
			</div>

			{/* Floating Action Button for Mobile */}
			<FloatingActionButton onPress={onOpenAddModal} isDisabled={isLoading} />

			{/* Add Product Modal */}
			<AddProductModal
				isOpen={isAddModalOpen}
				onClose={onCloseAddModal}
				onSave={handleSaveProduct}
			/>
		</div>
	);
}
