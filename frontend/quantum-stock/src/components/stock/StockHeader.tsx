'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

type StockHeaderProps = {
	onAddProduct: () => void;
	isLoading: boolean;
};

export default function StockHeader({
	onAddProduct,
	isLoading,
}: Readonly<StockHeaderProps>) {
	return (
		<div className="sticky top-0 z-10">
			<div className="border-b backdrop-blur-xl bg-background/70 border-divider/20">
				<div className="container px-4 py-4 mx-auto">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-xl bg-primary/10">
								<Icon icon="lucide:package" className="text-2xl text-primary" />
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
							onPress={onAddProduct}
							isDisabled={isLoading}
						>
							Nuevo Artículo
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
