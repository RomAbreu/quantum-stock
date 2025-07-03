'use client';

import { formatCategory } from '@/lib/utils/category.utils';
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

type ControlPanelProps = {
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	filterCategory: string;
	setFilterCategory: (category: string) => void;
	categories: string[];
	viewMode: 'table' | 'cards';
	setViewMode: (mode: 'table' | 'cards') => void;
	onRefresh: () => void;
	isLoading: boolean;
	filteredItemsCount: number;
};

export default function ControlPanel({
	searchTerm,
	setSearchTerm,
	filterCategory,
	setFilterCategory,
	categories,
	viewMode,
	setViewMode,
	onRefresh,
	isLoading,
	filteredItemsCount,
}: Readonly<ControlPanelProps>) {
	return (
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
							isDisabled={isLoading}
						/>
						<Select
							className="w-full sm:w-48"
							placeholder="Filtrar por categoría"
							selectedKeys={[filterCategory]}
							onSelectionChange={(keys) =>
								setFilterCategory(Array.from(keys)[0] as string)
							}
							variant="bordered"
							isDisabled={isLoading}
						>
							<SelectItem key="all">Todas las categorías</SelectItem>
							{categories.map((category) => (
								<SelectItem key={category}>
									{formatCategory(category)}
								</SelectItem>
							))}
						</Select>
					</div>

					{/* View Mode Toggle and Refresh Button */}
					<div className="flex items-center gap-2">
						<Chip variant="flat" size="sm">
							{filteredItemsCount} resultados
						</Chip>
						<Button
							isIconOnly
							size="sm"
							variant="light"
							onPress={onRefresh}
							isLoading={isLoading}
						>
							<Icon icon="lucide:refresh-cw" />
						</Button>
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
	);
}
