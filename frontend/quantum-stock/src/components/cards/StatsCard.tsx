'use client';

import type Product from '@/lib/model/product.model';
import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';

type StatCard = {
    title: string;
    value: string | number;
    icon: string;
    color: 'primary' | 'success' | 'warning' | 'danger';
    subtitle?: string;
    tooltip?: string;
};

type StatsCardsProps = {
    stockItems: Product[] | undefined | null;
};

export default function StatsCards({ stockItems = [] }: Readonly<StatsCardsProps>) {
    // Use empty array if stockItems is null or undefined
    const items = Array.isArray(stockItems) ? stockItems : [];

    // Calculate stock statistics
    const lowStockItems = items.filter(
        (item) => item.quantity > 0 && item.quantity <= (item.minQuantity ?? 0),
    );
    const outOfStockItems = items.filter((item) => item.quantity === 0);
    const availableItems = items.filter(
        (item) => item.quantity > (item.minQuantity ?? 0),
    );

    // Calculate additional metrics
    const totalStock = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    ).toFixed(2);

    const totalItems = items.length;

    const statsData: StatCard[] = [
        {
            title: 'Total Productos',
            value: totalItems,
            subtitle: 'Total en inventario',
            icon: 'lucide:package',
            color: 'primary',
        },
        {
            title: 'Stock Normal',
            value: availableItems.length,
            subtitle: `${totalItems > 0 ? Math.round((availableItems.length / totalItems) * 100) : 0}% del inventario`,
            icon: 'lucide:check-circle',
            color: 'success',
            tooltip: 'Productos con cantidad superior al mínimo requerido',
        },
        {
            title: 'Stock Bajo',
            value: lowStockItems.length,
            subtitle: `Requieren atención`,
            icon: 'lucide:alert-triangle',
            color: 'warning',
            tooltip: 'Productos con cantidad inferior o igual al mínimo requerido',
        },
        {
            title: 'Sin Stock',
            value: outOfStockItems.length,
            subtitle: `${totalItems > 0 ? Math.round((outOfStockItems.length / totalItems) * 100) : 0}% del inventario`,
            icon: 'lucide:x-circle',
            color: 'danger',
            tooltip: 'Productos agotados (cantidad 0)',
        },
        {
            title: 'Unidades Totales',
            value: totalStock,
            subtitle: 'Suma de todas las cantidades',
            icon: 'lucide:layers',
            color: 'primary',
        },
        {
            title: 'Valor Total',
            value: `$${totalValue}`,
            subtitle: 'Valor monetario del inventario',
            icon: 'lucide:dollar-sign',
            color: 'success',
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

    const getBackgroundColorClasses = (color: StatCard['color']) => {
        switch (color) {
            case 'primary':
                return 'bg-primary/10';
            case 'success':
                return 'bg-success/10';
            case 'warning':
                return 'bg-warning/10';
            case 'danger':
                return 'bg-danger/10';
            default:
                return 'bg-primary/10';
        }
    };

    return (
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3 lg:grid-cols-6">
            {statsData.map((stat) => (
                <Card
                    key={stat.title}
                    className="transition-all duration-200 shadow-sm hover:shadow-md"
                    isPressable
                >
                    <CardBody className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-default-500">{stat.title}</p>
                                <p
                                    className={`text-2xl font-bold ${getColorClasses(stat.color)}`}
                                >
                                    {stat.value}
                                </p>
                                {stat.subtitle && (
                                    <p className="mt-1 text-xs text-default-400">{stat.subtitle}</p>
                                )}
                            </div>
                            <div className={`p-2 rounded-full ${getBackgroundColorClasses(stat.color)}`}>
                                <Icon
                                    icon={stat.icon}
                                    className={`text-2xl ${getColorClasses(stat.color)}`}
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}