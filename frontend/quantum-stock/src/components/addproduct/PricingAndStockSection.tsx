'use client';

import type { NewProductData } from '@components/forms/types/product.types';
import { Input } from '@heroui/react';
import { Icon } from '@iconify/react';

type PricingAndStockSectionProps = {
	formData: NewProductData;
	errors: Partial<Record<keyof NewProductData, string>>;
	updateField: (field: keyof NewProductData, value: string | number) => void;
	isDisabled: boolean;
};

export default function PricingAndStockSection({
	formData,
	errors,
	updateField,
	isDisabled,
}: Readonly<PricingAndStockSectionProps>) {
	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2 mb-3">
				<Icon icon="lucide:dollar-sign" className="text-success" />
				<h3 className="font-semibold">Precio y Stock</h3>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Input
					name="price"
					label="Precio"
					placeholder="0.00"
					type="number"
					value={formData.price.toString()}
					onValueChange={(value) =>
						updateField('price', Number.parseFloat(value) || 0)
					}
					isInvalid={!!errors.price}
					errorMessage={errors.price}
					startContent={
						<div className="flex items-center pointer-events-none">
							<span className="text-default-400 text-small">$</span>
						</div>
					}
					variant="bordered"
					isRequired
					isDisabled={isDisabled}
				/>

				<Input
					name="quantity"
					label="Cantidad Inicial"
					placeholder="0"
					type="number"
					value={formData.initialQuantity.toString()}
					onValueChange={(value) =>
						updateField('initialQuantity', Number.parseInt(value) || 0)
					}
					isInvalid={!!errors.initialQuantity}
					errorMessage={errors.initialQuantity}
					startContent={
						<Icon icon="lucide:package" className="text-default-400" />
					}
					variant="bordered"
					isRequired
					isDisabled={isDisabled}
				/>
			</div>

			<Input
				name="minQuantity"
				label="Stock Mínimo"
				placeholder="0"
				type="number"
				value={formData.minQuantity.toString()}
				onValueChange={(value) =>
					updateField('minQuantity', Number.parseInt(value) || 0)
				}
				isInvalid={!!errors.minQuantity}
				errorMessage={errors.minQuantity}
				startContent={
					<Icon icon="lucide:alert-triangle" className="text-warning" />
				}
				variant="bordered"
				description="Cantidad mínima antes de mostrar alerta de stock bajo"
				isRequired
				isDisabled={isDisabled}
			/>
		</div>
	);
}
