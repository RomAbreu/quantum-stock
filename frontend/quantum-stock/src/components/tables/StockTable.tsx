'use client';

import { getCategoryLabel, isValidCategory } from '@/lib/constants/categories.constants';
import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import type React from 'react';
import { useCallback } from 'react';
import type Product from '@/lib/model/product.model';

export const stockColumns = [
  { name: 'Nombre', uid: 'name' },
  { name: 'Descripción', uid: 'description' },
  { name: 'Categoría', uid: 'category' },
  { name: 'Precio', uid: 'price' },
  { name: 'Cantidad', uid: 'quantity' },
  { name: 'Stock Mínimo', uid: 'minQuantity' },
  { name: 'Acciones', uid: 'actions' },
];

type StockTableProps = {
  stockItems: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export default function StockTable({
  stockItems,
  onEdit,
  onDelete,
}: Readonly<StockTableProps>) {

  const getQuantityColor = (quantity: number, minQuantity: number) => {
    if (quantity === 0) return 'danger';
    if (quantity <= minQuantity) return 'warning';
    return 'success';
  };

  const getCategoryDisplay = (category: string) => {
    return isValidCategory(category) 
      ? getCategoryLabel(category) 
      : category;
  };

  const renderCell = useCallback((item: Product, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return (
          <div className="flex flex-col">
            <p className="text-sm font-semibold">{item.name}</p>
          </div>
        );
      case 'description':
        return (
          <div className="max-w-xs">
            <p className="text-sm text-default-600 line-clamp-2">
              {item.description}
            </p>
          </div>
        );
      case 'category':
        return (
          <Chip variant="flat" size="sm" color="primary">
            {getCategoryDisplay(item.category)}
          </Chip>
        );
      case 'price':
        return (
          <span className="text-sm font-semibold text-success">
            ${item.price.toFixed(2)}
          </span>
        );
      case 'quantity':
        return (
          <Chip
            variant="dot"
            color={getQuantityColor(item.quantity, item.minQuantity ?? 0)}
            size="sm"
          >
            {item.quantity}
          </Chip>
        );
      case 'minQuantity':
        return <span className="text-sm text-warning">{item.minQuantity ?? 0}</span>;
      case 'actions':
        return (
          <div className="flex items-center justify-center gap-1 w-full min-w-[100px]">
            <Tooltip content="Editar">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onEdit(item)}
                className="h-8 min-w-8"
              >
                <Icon icon="lucide:edit" className="text-base" />
              </Button>
            </Tooltip>
            <Tooltip content="Eliminar" color="danger">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onPress={() => onDelete(item)}
                className="h-8 min-w-8"
              >
                <Icon icon="lucide:trash-2" className="text-base" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return <></>;
    }
  }, [onEdit, onDelete]);

  return (
    <div className="border rounded-lg bg-content1">
      <Table aria-label="Stock table">
        <TableHeader columns={stockColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
              width={column.uid === 'actions' ? 120 : undefined}
            >
              <Chip variant="bordered">
                <span className="font-bold">{column.name}</span>
              </Chip>
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={stockItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell
                  className={columnKey === 'actions' ? 'text-center w-[120px]' : ''}
                >
                  {renderCell(item, columnKey as string) as React.ReactNode}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}