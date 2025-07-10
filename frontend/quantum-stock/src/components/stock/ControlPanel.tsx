'use client';

import FilterByCategory from '@/components/filters/FilterByCategory';
import FilterByMaxPrice from '@/components/filters/FilterByMaxPrice';
import FilterByMinPrice from '@/components/filters/FilterByMinPrice';
import { useSearchQuery } from '@/lib/hooks/useSearchQuery';
import {
    Button,
    Card,
    CardBody,
    Chip,
    Input,
} from '@heroui/react';
import { Icon } from '@iconify/react';

type ControlPanelProps = {
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
    filterCategory,
    setFilterCategory,
    viewMode,
    setViewMode,
    onRefresh,
    categories,
    isLoading,
    filteredItemsCount,
}: Readonly<ControlPanelProps>) {
    const { inputValue, handleInputChange, clearSearch, currentQuery } = useSearchQuery({
        minLength: 1,
        debounceTime: 500,
    });

    return (
        <Card className="mb-6 shadow-lg animate-fade-in-up animation-delay-300">
            <CardBody className="p-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Input
                            className="w-full"
                            placeholder="Buscar por nombre o descripción..."
                            startContent={
                                <Icon icon="lucide:search" className="text-default-400" />
                            }
                            type="text"
                            value={inputValue}
                            onValueChange={handleInputChange}
                            variant="bordered"
                            isDisabled={isLoading}
                            size="sm"
                            isClearable
                            onClear={clearSearch}
                        />
                        {(inputValue || currentQuery) && (
                            <Chip 
                                className="ml-2" 
                                variant="flat" 
                                color="primary" 
                                size="sm"
                                onClose={clearSearch}
                            >
                                Buscando: {inputValue || currentQuery}
                            </Chip>
                        )}
                    </div>
                    
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="flex flex-wrap gap-3">
                            <FilterByCategory 
                                defaultValue={filterCategory}
                                onChange={setFilterCategory}
                            />
                            <FilterByMinPrice 
                                label="Precio Mínimo"
                                placeholder="Precio mínimo..."
                            />
                            <FilterByMaxPrice 
                                label="Precio Máximo"
                                placeholder="Precio máximo..."
                            />
                        </div>

                        <div className="flex items-center gap-2 mt-3 md:mt-0">
                            <Chip variant="flat" size="sm" color="secondary">
                                {filteredItemsCount} resultado{filteredItemsCount !== 1 ? 's' : ''}
                            </Chip>
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={onRefresh}
                                isLoading={isLoading}
                                title="Actualizar"
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
                                    title="Vista de tabla"
                                >
                                    <Icon icon="lucide:table" />
                                </Button>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant={viewMode === 'cards' ? 'solid' : 'light'}
                                    color={viewMode === 'cards' ? 'primary' : 'default'}
                                    onPress={() => setViewMode('cards')}
                                    title="Vista de tarjetas"
                                >
                                    <Icon icon="lucide:grid-3x3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}