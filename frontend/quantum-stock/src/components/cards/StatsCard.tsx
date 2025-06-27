'use client';

import type { StockItem } from '@/components/tables/StockTable';
import { Icon } from '@iconify/react';

type StatCard = {
	title: string;
	value: number;
	icon: string;
	color: 'primary' | 'success' | 'warning' | 'danger';
};

type StatsCardsProps = {
	stockItems: StockItem[];
};

export default function StatsCards({ stockItems }: Readonly<StatsCardsProps>) {
	const lowStockItems = stockItems.filter(
		(item) => item.quantity > 0 && item.quantity <= item.minimumStock,
	);
	const outOfStockItems = stockItems.filter((item) => item.quantity === 0);
	const availableItems = stockItems.filter(
		(item) => item.quantity > item.minimumStock,
	);

	const statsData: StatCard[] = [
		{
			title: 'Total Items',
			value: stockItems.length,
			icon: 'lucide:package',
			color: 'primary',
		},
		{
			title: 'Disponibles',
			value: availableItems.length,
			icon: 'lucide:check-circle',
			color: 'success',
		},
		{
			title: 'Stock Bajo',
			value: lowStockItems.length,
			icon: 'lucide:alert-triangle',
			color: 'warning',
		},
		{
			title: 'Sin Stock',
			value: outOfStockItems.length,
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
				<div key={stat.title} className="p-4 border rounded-lg bg-content1">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-default-500">{stat.title}</p>
							<p
								className={`text-2xl font-bold ${getColorClasses(stat.color)}`}
							>
								{stat.value}
							</p>
						</div>
						<Icon
							icon={stat.icon}
							className={`text-2xl ${getColorClasses(stat.color)}`}
						/>
					</div>
				</div>
			))}
		</div>
	);
}
