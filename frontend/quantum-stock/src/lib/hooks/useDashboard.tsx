import type Product from '@/lib/model/product.model';
import { useEffect, useState } from 'react';
import { useInventoryMovements } from './useMovement';

type StockByCategory = {
	title: string;
	color: string;
	total: number;
	chartData: { name: string; value: number; fill: string }[];
};

type TopProduct = {
	name: string;
	value: number;
};

type LowStockProduct = {
	id: string | number;
	name: string;
	category: string;
	currentStock: number;
	minStock: number;
	lastRestock: string;
	status: 'critical' | 'low' | 'normal';
};

type DashboardData = {
	stockByCategory: StockByCategory[];
	topProducts: {
		title: string;
		categories: string[];
		color: string;
		chartData: TopProduct[];
	};
	lowStockProducts: LowStockProduct[];
	isLoading: boolean;
};

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

const getColorByCategory = (category: string): string => {
	const colors: Record<string, string> = {
		ELECTRONICS: 'primary',
		CLOTHING: 'secondary',
		HOME: 'success',
		HEALTH: 'success',
		TOYS: 'default',
		SPORTS: 'warning',
		BOOKS: 'danger',
		FOOD: 'default',
		PET_SUPPLIES: 'success',
		AUTOMOTIVE: 'secondary',
	};

	return colors[category] || 'primary';
};

const getFillByColor = (color: string): string => {
	const fills: Record<string, string> = {
		primary: '#006FEE',
		secondary: '#7828C8',
		success: '#17C964',
		warning: '#F5A524',
		danger: '#F31260',
		default: '#71717A',
	};

	return fills[color] || '#006FEE';
};

export const useDashboard = (): DashboardData => {
	const [dashboardData, setDashboardData] = useState<DashboardData>({
		stockByCategory: [],
		topProducts: {
			title: 'Productos Más Vendidos',
			categories: [],
			color: 'primary',
			chartData: [],
		},
		lowStockProducts: [],
		isLoading: true,
	});

	const { movements, isLoading, isError } = useInventoryMovements();

	useEffect(() => {
		if (isError) {
			console.error('Error obteniendo datos:', isError);
			setDashboardData({
				stockByCategory: [],
				topProducts: {
					title: 'Productos Más Vendidos',
					categories: [],
					color: 'primary',
					chartData: [],
				},
				lowStockProducts: [],
				isLoading: false,
			});
			return;
		}

		if (!isLoading && movements.length > 0) {
			const categoryCounts: Record<string, { total: number; inStock: number }> =
				{};
			const productCounts: Record<string, number> = {};
			const productInfo: Record<string, Product> = {};
			const lowStockList: LowStockProduct[] = [];

			for (const { product, quantityChange, type } of movements) {
				const productId = product.id;
				const category = product.category || 'Sin categoría';
				const absChange = Math.abs(quantityChange);

				productInfo[productId] ??= product;

				if (type === 'OUT') {
					productCounts[productId] =
						(productCounts[productId] || 0) + absChange;
				}

				categoryCounts[category] ??= { total: 0, inStock: 0 };

				categoryCounts[category].total += absChange;
				categoryCounts[category].inStock +=
					type === 'IN' ? absChange : -absChange;
			}

			const stockByCategory: StockByCategory[] = Object.entries(
				categoryCounts,
			).map(([category, data]) => {
				const color = getColorByCategory(category);
				const fill = getFillByColor(color);
				const title = categoryLabels[category] || category;

				return {
					title,
					color,
					total: data.total,
					chartData: [
						{ name: 'En Stock', value: Math.max(0, data.inStock), fill },
					],
				};
			});

			const topProductsArray = Object.entries(productCounts)
				.sort((a, b) => b[1] - a[1])
				.slice(0, 5)
				.map(([productId, count]) => ({
					name: productInfo[productId]?.name || 'Producto Desconocido',
					value: count,
				}));

			const topProductsTotal = topProductsArray.reduce(
				(sum, item) => sum + item.value,
				0,
			);
			const otherProductsTotal =
				Object.values(productCounts).reduce((sum, count) => sum + count, 0) -
				topProductsTotal;

			if (otherProductsTotal > 0) {
				topProductsArray.push({
					name: 'Otros',
					value: otherProductsTotal,
				});
			}

			const lastRestocks: Record<string, string> = {};

			for (const movement of movements) {
				if (movement.type === 'IN') {
					const { id } = movement.product;
					const date = new Date(movement.date);

					if (!lastRestocks[id] || date > new Date(lastRestocks[id])) {
						lastRestocks[id] = movement.date;
					}
				}
			}

			for (const [id, product] of Object.entries(productInfo)) {
				if (product.quantity > product.minQuantity) continue;

				const stockRatio = product.quantity / product.minQuantity;
				let status: 'critical' | 'low' | 'normal' = 'normal';

				if (stockRatio <= 0.15) {
					status = 'critical';
				} else if (stockRatio <= 0.5) {
					status = 'low';
				}

				if (status !== 'normal') {
					lowStockList.push({
						id,
						name: product.name,
						category: product.category || 'Sin categoría',
						currentStock: product.quantity || 0,
						minStock: product.minQuantity || 0,
						lastRestock: lastRestocks[id]?.split('T')[0] || 'N/A',
						status,
					});
				}
			}

			setDashboardData({
				stockByCategory,
				topProducts: {
					title: 'Productos Más Vendidos',
					categories: topProductsArray.map((p) => p.name),
					color: 'primary',
					chartData: topProductsArray,
				},
				lowStockProducts: lowStockList,
				isLoading: false,
			});
		} else if (!isLoading && movements.length === 0) {
			setDashboardData({
				stockByCategory: [],
				topProducts: {
					title: 'Productos Más Vendidos',
					categories: [],
					color: 'primary',
					chartData: [],
				},
				lowStockProducts: [],
				isLoading: false,
			});
		}
	}, [isLoading, isError, movements]);

	return dashboardData;
};
