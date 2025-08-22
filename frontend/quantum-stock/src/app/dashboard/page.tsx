'use client';

import { useDashboard } from '@/lib/hooks/useDashboard';
import { Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useKeycloak } from '@react-keycloak/web';
import React, { useState, useEffect } from 'react';

import MovementsCards from '@/components/cards/MovementsCards';
import CircleChartCard from '@/components/charts/CircleChartCard';
import RadialChartCard from '@/components/charts/RadialChartCard';
import DashboardLoader from '@/components/loaders/DashboardLoader';
import LowStockTable from '@/components/tables/LowStockTable';

export default function Dashboard() {
	const [initialLoading, setInitialLoading] = useState(true);
	const { stockByCategory, topProducts, lowStockProducts, isLoading } =
		useDashboard();
	const { keycloak, initialized } = useKeycloak();

	useEffect(() => {
		if (initialized && !keycloak.authenticated) {
			sessionStorage.setItem('redirectAfterLogin', '/dashboard');

			keycloak.login({
				redirectUri: `${window.location.origin}/dashboard`,
			});
		}
	}, [initialized, keycloak]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setInitialLoading(false);
		}, 1000);
		return () => clearTimeout(timer);
	}, []);

	if (!initialized || initialLoading || isLoading) {
		return <DashboardLoader />;
	}

	if (initialized && !keycloak.authenticated) {
		return (
			<div className="flex items-center justify-center min-h-screen p-6 bg-background">
				<div className="text-center">
					<h1 className="mb-2 text-2xl font-bold">Acceso restringido</h1>
					<p className="mb-4 text-default-500">
						Necesitas iniciar sesión para ver el dashboard.
					</p>
					<Button
						color="primary"
						onPress={() =>
							keycloak.login({
								redirectUri: `${window.location.origin}/dashboard`,
							})
						}
					>
						Iniciar Sesión
					</Button>
				</div>
			</div>
		);
	}

	const totalProducts = stockByCategory.reduce(
		(sum, item) => sum + item.total,
		0,
	);
	const totalInStock = stockByCategory.reduce(
		(sum, item) => sum + (item.chartData[0]?.value || 0),
		0,
	);
	const lowStockCount = lowStockProducts.length;

	const handleRefreshData = () => {
		window.location.reload();
	};

	return (
		<div className="min-h-screen p-6 bg-background">
			<div className="mx-auto space-y-8 max-w-7xl">
				{/* Header */}
				<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
					<div>
						<h1 className="text-3xl font-bold text-foreground">
							Dashboard de Inventario
						</h1>
						<p className="mt-1 text-default-500">
							Gestión y monitoreo de stock en tiempo real
						</p>
					</div>
					<div className="flex items-center gap-3">
						<Button
							color="primary"
							startContent={
								<Icon icon="lucide:refresh-cw" className="w-4 h-4" />
							}
							onPress={handleRefreshData}
						>
							Actualizar Datos
						</Button>
					</div>
				</div>

				{/* Estadísticas generales */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<MovementsCards
						title="Total de Productos"
						value={totalProducts.toLocaleString()}
						icon="lucide:package"
						color="primary"
					/>
					<MovementsCards
						title="Stock Disponible"
						value={totalInStock.toLocaleString()}
						change={2.5}
						icon="lucide:layers"
						color="success"
					/>
					<MovementsCards
						title="Productos con Stock Bajo"
						value={lowStockCount}
						change={-4.2}
						icon="lucide:alert-triangle"
						color="danger"
					/>
					<MovementsCards
						title="Reabastecimientos Pendientes"
						value={Math.ceil(lowStockCount * 0.8)}
						icon="lucide:refresh-cw"
						color="warning"
					/>
				</div>

				{/* Stock por Categorías */}
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-semibold text-foreground">
								Stock por Categorías
							</h2>
							<p className="mt-1 text-sm text-default-500">
								Distribución del inventario actual
							</p>
						</div>
						<div className="flex items-center gap-2 text-sm text-default-500">
							<Icon
								icon="lucide:alert-triangle"
								className="w-4 h-4 text-warning"
							/>
							<span>Stock bajo: menos del 30% del total</span>
						</div>
					</div>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
						{stockByCategory.map((item) => (
							<RadialChartCard key={item.title} {...item} />
						))}
					</div>
				</div>

				{/* Productos Más Vendidos */}
				<div className="space-y-6">
					<div>
						<h2 className="text-xl font-semibold text-foreground">
							Productos Más Vendidos
						</h2>
						<p className="mt-1 text-sm text-default-500">
							Ranking de productos por volumen de ventas
						</p>
					</div>
					<CircleChartCard {...topProducts} />
				</div>

				{/* Tabla de Productos con Stock Mínimo */}
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-semibold text-foreground">
								Productos con Stock Mínimo
							</h2>
							<p className="mt-1 text-sm text-default-500">
								Productos que requieren reabastecimiento urgente
							</p>
						</div>
						<Chip color="danger" variant="flat" size="lg">
							{lowStockProducts.length} productos
						</Chip>
					</div>

					<LowStockTable products={lowStockProducts} />
				</div>
			</div>
		</div>
	);
}
