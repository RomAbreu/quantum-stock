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
import { useEffect } from 'react';

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
    // Use the search hook
    const { inputValue, handleInputChange, clearSearch, currentQuery } = useSearchQuery();
    
    // Sync the hook's query with the parent component's searchTerm
    useEffect(() => {
        if (currentQuery !== searchTerm) {
            setSearchTerm(currentQuery);
        }
    }, [currentQuery, setSearchTerm, searchTerm]);

    return (
        <Card className="mb-6 shadow-lg animate-fade-in-up animation-delay-300">
            <CardBody className="p-6">
                <div className="flex flex-col gap-4">
                    {/* Search Bar */}
                    <div className="flex items-center">
                        <Input
                            className="w-full"
                            placeholder="Buscar por nombre o descripción..."
                            startContent={
                                <Icon icon="lucide:search" className="text-default-400" />
                            }
                            value={inputValue}
                            onValueChange={handleInputChange}
                            variant="bordered"
                            isDisabled={isLoading}
                            size="sm"
                            clearable
                            onClear={clearSearch}
                        />
                    </div>
                    
                    {/* Filters Row */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="flex flex-wrap gap-3">
                            <FilterByCategory 
                                categories={categories} 
                                defaultValue={filterCategory}
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

                        {/* View Mode Toggle and Refresh Button */}
                        <div className="flex items-center gap-2 mt-3 md:mt-0">
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
                </div>
            </CardBody>
        </Card>
    );
}