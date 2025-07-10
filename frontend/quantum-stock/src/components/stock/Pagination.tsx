import React from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  totalElements?: number;
  pageSize?: number;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  totalElements = 0,
  pageSize = 10
}: Readonly<PaginationProps>) {
  // No mostrar paginación si hay solo 1 página o menos
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const maxVisible = 5;
    const pages = [];
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalElements);

  return (
    <div className="flex flex-col items-center justify-between gap-4 p-4 mt-6 border rounded-lg bg-content1 sm:flex-row">
      <div className="text-sm text-default-600">
        Mostrando {startItem} a {endItem} de {totalElements} productos
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="bordered"
          size="sm"
          isIconOnly
          onPress={() => onPageChange(1)}
          isDisabled={currentPage === 1 || isLoading}
          className="hidden sm:flex"
        >
          <Icon icon="lucide:chevrons-left" className="text-base" />
        </Button>
        
        <Button
          variant="bordered"
          size="sm"
          isIconOnly
          onPress={() => onPageChange(currentPage - 1)}
          isDisabled={currentPage === 1 || isLoading}
        >
          <Icon icon="lucide:chevron-left" className="text-base" />
        </Button>
        
        {getVisiblePages().map((pageNum) => (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "solid" : "bordered"}
            color={currentPage === pageNum ? "primary" : "default"}
            size="sm"
            onPress={() => onPageChange(pageNum)}
            isDisabled={isLoading}
            className="min-w-10"
          >
            {pageNum}
          </Button>
        ))}
        
        <Button
          variant="bordered"
          size="sm"
          isIconOnly
          onPress={() => onPageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages || isLoading}
        >
          <Icon icon="lucide:chevron-right" className="text-base" />
        </Button>
        
        <Button
          variant="bordered"
          size="sm"
          isIconOnly
          onPress={() => onPageChange(totalPages)}
          isDisabled={currentPage === totalPages || isLoading}
          className="hidden sm:flex"
        >
          <Icon icon="lucide:chevrons-right" className="text-base" />
        </Button>
      </div>
    </div>
  );
}