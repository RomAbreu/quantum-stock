'use client';

import { usePaginatedInventoryMovements } from '@/lib/hooks/useMovement';
import type InventoryMovement from '@/lib/model/movement.model';
import {
    Button,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { useCallback, useEffect, useState } from 'react';
import Pagination from '@/components/stock/Pagination';

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
        refreshMovements,
    } = usePaginatedInventoryMovements();

    const [currentPage, setCurrentPage] = useState(1);
    const [visibleMovements, setVisibleMovements] = useState<InventoryMovement[]>(
        [],
    );

    const pageSize = 10;
    const totalPages = Math.ceil(totalElements / pageSize);

    useEffect(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = currentPage * pageSize;

        const newVisibleMovements = movements.slice(startIndex, endIndex);
        if (
            JSON.stringify(newVisibleMovements) !== JSON.stringify(visibleMovements)
        ) {
            setVisibleMovements(newVisibleMovements);
        }
    }, [movements, currentPage, pageSize, visibleMovements]);

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
                            <span className="text-sm font-semibold">
                                {movement.product.name}
                            </span>
                            <span className="text-xs text-default-500">
                                ID: {movement.product.id}
                            </span>
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
                        <span
                            className={
                                movement.type === 'IN'
                                    ? 'text-success-600 font-semibold'
                                    : 'text-warning-600 font-semibold'
                            }
                        >
                            {movement.type === 'IN' ? '+' : '-'}
                            {Math.abs(movement.quantityChange)}
                        </span>
                    );
                case 'user':
                    return <span className="text-sm">{movement.user}</span>;
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
        [formatDate],
    );

    return (
        <div className="min-h-screen p-6 bg-background">
            <div className="mx-auto space-y-8 max-w-7xl">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Movimientos de Inventario
                        </h1>
                        <p className="mt-1 text-default-500">
                            Historial de entradas y salidas de productos
                            {totalElements > 0 && ` (${totalElements} resultados)`}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            color="primary"
                            startContent={
                                <Icon icon="lucide:refresh-cw" className="w-4 h-4" />
                            }
                            onPress={() => refreshMovements()}
                        >
                            Actualizar Datos
                        </Button>
                    </div>
                </div>

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
                        <TableBody
                            items={visibleMovements}
                            emptyContent="No hay movimientos para mostrar"
                        >
                            {(movement) => (
                                <TableRow key={movement.id}>
                                    {(columnKey) => (
                                        <TableCell>
                                            {
                                                renderCell(
                                                    movement,
                                                    columnKey as string,
                                                ) as React.ReactNode
                                            }
                                        </TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalElements={totalElements}
                    pageSize={pageSize}
                />
            </div>
        </div>
    );
}