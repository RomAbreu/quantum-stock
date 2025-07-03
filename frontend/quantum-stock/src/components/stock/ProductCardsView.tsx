'use client';

import type { StockItem } from '@/components/tables/StockTable';
import { Button, Card, CardBody, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';

type ProductCardsViewProps = {
	items: StockItem[];
	onEdit: (id: string, item: StockItem) => void;
	onDelete: (id: string) => void;
};

export default function ProductCardsView({
	items,
	onEdit,
	onDelete,
}: Readonly<ProductCardsViewProps>) {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{items.map((item) => (
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
										: item.quantity <= item.minQuantity
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
											: item.quantity <= item.minQuantity
												? 'text-warning'
												: 'text-success'
									}`}
								>
									{item.quantity}
								</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-default-500">Stock Mínimo:</span>
								<span className="text-warning">{item.minQuantity}</span>
							</div>
						</div>
						<div className="flex gap-2">
							<Button
								size="sm"
								variant="light"
								startContent={<Icon icon="lucide:edit" />}
								onPress={() => onEdit(item.id, item)}
								className="flex-1"
							>
								Editar
							</Button>
							<Button
								size="sm"
								variant="light"
								color="danger"
								isIconOnly
								onPress={() => onDelete(item.id)}
							>
								<Icon icon="lucide:trash-2" />
							</Button>
						</div>
					</CardBody>
				</Card>
			))}
		</div>
	);
}
