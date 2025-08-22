'use client';

import { usePaginatedInventoryMovements } from '@/lib/hooks/useMovement';
import { usePagination } from '@/lib/hooks/usePagination';
import { 
    Chip, 
    Table, 
    TableBody, 
    TableCell, 
    TableColumn, 
    TableHeader, 
    TableRow, 
    Tooltip, 
    Button,
    Pagination
} from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { useCallback, useEffect, useState } from 'react';
import type InventoryMovement from '@/lib/model/movement.model';

const movementColumns = [
    { name: 'Producto', uid: 'product' },
    { name: 'Tipo', uid: 'type' },
    { name: 'Cantidad', uid: 'quantityChange' },
    { name: 'Usuario', uid: 'user' },
    { name: 'Fecha', uid: 'date' },
];

export default function MovementsPage() {
    const { 
        movements, 
        totalElements, 
        totalPages,
        currentPage,
        refreshMovements
    } = usePaginatedInventoryMovements();

    const pagination = usePagination({
        totalRegisters: totalElements,
        registersPerPage: 10,
        siblingsCount: 1,
        pageParam: 'page',
    });

    const [visibleMovements, setVisibleMovements] = useState<InventoryMovement[]>([]);

    useEffect(() => {
        // Actualizar solo los movimientos visibles cuando cambia la página
        const startIndex = (pagination.currentPage - 1) * pagination.registersPerPage;
        const endIndex = pagination.currentPage * pagination.registersPerPage;

        // Evitar actualizaciones innecesarias
        const newVisibleMovements = movements.slice(startIndex, endIndex);
        if (JSON.stringify(newVisibleMovements) !== JSON.stringify(visibleMovements)) {
            setVisibleMovements(newVisibleMovements);
        }
    }, [movements, pagination.currentPage, pagination.registersPerPage, visibleMovements]);

    const formatDate = useCallback((dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    }, []);

    const renderCell = useCallback(
        (movement: InventoryMovement, columnKey: string) => {
            switch (columnKey) {
                case 'product':
                    return (
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">{movement.product.name}</span>
                            <span className="text-xs text-default-500">ID: {movement.product.id}</span>
                        </div>
                    );
                case 'type':
                    return (
                        <Chip
                            variant="flat"
                            size="sm"
                            color={movement.type === 'IN' ? 'success' : 'warning'}
                        >
                            {movement.type === 'IN' ? 'Entrada' : 'Salida'}
                        </Chip>
                    );
                case 'quantityChange':
                    return (
                        <span className={movement.type === 'IN' ? 'text-success-600 font-semibold' : 'text-warning-600 font-semibold'}>
                            {movement.type === 'IN' ? '+' : '-'}{Math.abs(movement.quantityChange)}
                        </span>
                    );
                case 'user':
                    return (
                        <span className="text-sm">{movement.user}</span>
                    );
                case 'date':
                    return (
                        <span className="text-sm text-default-600">
                            {formatDate(movement.date)}
                        </span>
                    );
                default:
                    return <></>;
            }
        },
        [formatDate]
    );

    return (
        <div className="min-h-screen p-6 bg-background">
            <div className="mx-auto space-y-8 max-w-7xl">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Movimientos de Inventario</h1>
                        <p className="mt-1 text-default-500">
                            Historial de entradas y salidas de productos
                            {totalElements > 0 && ` (${totalElements} resultados)`}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            color="primary"
                            startContent={<Icon icon="lucide:refresh-cw" className="w-4 h-4" />}
                            onPress={() => refreshMovements()}
                        >
                            Actualizar Datos
                        </Button>
                    </div>
                </div>

                {/* Tabla con el mismo diseño que StockTable */}
                <div className="border rounded-lg bg-content1">
                    <Table aria-label="Tabla de movimientos de inventario">
                        <TableHeader columns={movementColumns}>
                            {(column) => (
                                <TableColumn key={column.uid} align="start">
                                    <Chip variant="bordered">
                                        <span className="font-bold">{column.name}</span>
                                    </Chip>
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody items={visibleMovements} emptyContent="No hay movimientos para mostrar">
                            {(movement) => (
                                <TableRow key={movement.id}>
                                    {(columnKey) => (
                                        <TableCell>
                                            {renderCell(movement, columnKey as string) as React.ReactNode}
                                        </TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Paginación usando el hook usePagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        {/* Botón página anterior */}
                        <Button
                            size="sm"
                            variant="light"
                            isDisabled={pagination.currentPage === 1}
                            onPress={pagination.goToPreviousPage}
                            startContent={<Icon icon="lucide:chevron-left" className="w-4 h-4" />}
                        >
                            Anterior
                        </Button>

                        {/* Páginas anteriores */}
                        {pagination.previousPages.map((page) => (
                            <Button 
                                key={page} 
                                size="sm"
                                variant="light"
                                onPress={() => pagination.goToPage(page)}
                            >
                                {page}
                            </Button>
                        ))}

                        {/* Página actual */}
                        <Button 
                            size="sm" 
                            color="primary" 
                            variant="solid"
                            isDisabled
                        >
                            {pagination.currentPage}
                        </Button>

                        {/* Páginas siguientes */}
                        {pagination.nextPages.map((page) => (
                            <Button 
                                key={page} 
                                size="sm"
                                variant="light"
                                onPress={() => pagination.goToPage(page)}
                            >
                                {page}
                            </Button>
                        ))}

                        {/* Botón página siguiente */}
                        <Button
                            size="sm"
                            variant="light"
                            isDisabled={pagination.currentPage === pagination.totalPages}
                            onPress={pagination.goToNextPage}
                            endContent={<Icon icon="lucide:chevron-right" className="w-4 h-4" />}
                        >
                            Siguiente
                        </Button>
                    </div>
                )}

                {/* Información de paginación */}
                {totalElements > 0 && (
                    <div className="flex justify-center">
                        <p className="text-sm text-default-500">
                            Mostrando {((pagination.currentPage - 1) * pagination.registersPerPage) + 1} a{' '}
                            {Math.min(pagination.currentPage * pagination.registersPerPage, totalElements)} de{' '}
                            {totalElements} resultados
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}