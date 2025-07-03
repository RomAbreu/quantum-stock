'use client';

import type { StockItem } from '@/components/tables/StockTable';
import { Icon } from '@iconify/react';

type StatCard = {
	title: string;
	value: string | number;
	icon: string;
	color: 'primary' | 'success' | 'warning' | 'danger';
	subtitle?: string;
};

type StatsCardsProps = {
	stockItems: StockItem[];
};

export default function StatsCards({ stockItems }: Readonly<StatsCardsProps>) {
	// Calculate stock statistics
	const lowStockItems = stockItems.filter(
		(item) => item.quantity > 0 && item.quantity <= item.minQuantity,
	);
	const outOfStockItems = stockItems.filter((item) => item.quantity === 0);
	const availableItems = stockItems.filter(
		(item) => item.quantity > item.minQuantity,
	);

	// Calculate additional metrics
	const totalStock = stockItems.reduce((sum, item) => sum + item.quantity, 0);
	const totalValue = stockItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	const statsData: StatCard[] = [
		{
			title: 'Total Productos',
			value: stockItems.length,
			subtitle: 'Total en inventario',
			icon: 'lucide:package',
			color: 'primary',
		},
		{
			title: 'Stock Normal',
			value: availableItems.length,
			subtitle: `${Math.round((availableItems.length / stockItems.length) * 100 || 0)}% del inventario`,
			icon: 'lucide:check-circle',
			color: 'success',
		},
		{
			title: 'Stock Bajo',
			value: lowStockItems.length,
			subtitle: `Requieren atención`,
			icon: 'lucide:alert-triangle',
			color: 'warning',
		},
		{
			title: 'Sin Stock',
			value: outOfStockItems.length,
			subtitle: `${Math.round((outOfStockItems.length / stockItems.length) * 100 || 0)}% del inventario`,
			icon: 'lucide:x-circle',
			color: 'danger',
		},
	];

	const getColorClasses = (color: StatCard['color']) => {
		switch (color) {
			case 'primary':
				return 'text-primary';
			case 'success':
				return 'text-success';
			case 'warning':
				return 'text-warning';
			case 'danger':
				return 'text-danger';
			default:
				return 'text-primary';
		}
	};

	return (
		<div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
			{statsData.map((stat) => (
				<div
					key={stat.title}
					className="p-4 border rounded-lg bg-content1 hover:shadow-md transition-all duration-200"
				>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-default-500">{stat.title}</p>
							<p
								className={`text-2xl font-bold ${getColorClasses(stat.color)}`}
							>
								{stat.value}
							</p>
							{stat.subtitle && (
								<p className="text-xs text-default-400 mt-1">{stat.subtitle}</p>
							)}
						</div>
						<div className={`p-2 rounded-full bg-${stat.color}/10`}>
							<Icon
								icon={stat.icon}
								className={`text-2xl ${getColorClasses(stat.color)}`}
							/>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
