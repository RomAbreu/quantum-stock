'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import BreadcrumbsBuilder, {
  type BreadCrumbNavigationItem,
} from '@/components/breadcrumbsBuilder/BreadCrumbsBuilder';
import StatsCards from '@/components/cards/StatsCard';
import AddProductModal from '@/components/modals/AddProductModal';
import EditProductModal from '@/components/modals/EditProductModal';
import DeleteProductModal from '@/components/modals/DeleteProductModal';
import StockTable from '@/components/tables/StockTable';
import ControlPanel from '@/components/stock/ControlPanel';
import FloatingActionButton from '@/components/stock/FloatingActionButton';
import ProductCardsView from '@/components/stock/ProductCardsView';
import StockHeader from '@/components/stock/StockHeader';
import Pagination from '@/components/stock/Pagination'; // Importar el componente nuevo
import {
  EmptyStateView,
  ErrorView,
  LoadingView,
} from '@/components/stock/StockStatusViews';
import { useStockPage } from '@/lib/hooks/useStockPage';
import type Product from '@/lib/model/product.model';

const breadcrumbItems: BreadCrumbNavigationItem[] = [
  { name: 'Inicio', href: '/' },
  { name: 'Inventario', href: '/stock' },
];

export default function StockPage() {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const searchParams = useSearchParams();
  
  const currentQuery = searchParams.get('query') ?? '';
  const currentPage = Number(searchParams.get('page')) || 1;
  const filterCategory = searchParams.get('category') ?? 'all';
  const minPrice = searchParams.get('minPrice') ?? '';
  const maxPrice = searchParams.get('maxPrice') ?? '';

  // Tamaño de página consistente
  const PAGE_SIZE = 2;

  const [searchKey, setSearchKey] = useState(0);

  useEffect(() => {
    setSearchKey(prev => prev + 1);
  }, [currentQuery, currentPage, filterCategory, minPrice, maxPrice]);

  const {
    products,
    totalElements,
    totalPages,
    error,
    isLoading,
    isValidating,
    isAuthChecking,
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
    isEditOpen,
    onEditClose,
    isDeleteOpen,
    onDeleteClose,
    handleEditProduct,
    handleDeleteProduct,
    handleUpdateProduct,
    handleDeleteProductConfirm,
    selectedProduct,
    refreshProducts,
  } = useStockPage({
    query: currentQuery,
    page: currentPage,
    category: filterCategory !== 'all' ? filterCategory : undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    size: PAGE_SIZE, // Usar constante
  });

  const handleSaveProduct = async (newProduct: Product) => {
    console.log('Product saved successfully:', newProduct);
    refreshProducts();
  };

  const handleRefresh = () => {
    refreshProducts();
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1'); // Reset to page 1
    
    if (category && category !== 'all') {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    
    window.history.pushState({}, '', `?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    window.history.pushState({}, '', `?${params.toString()}`);
  };

  if (isAuthChecking) {
    return <LoadingView message="Verificando autenticación..." />;
  }

  const categories = Array.isArray(products) 
    ? [...new Set(products.map(p => p.category).filter(Boolean))]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-content1">
      <StockHeader
        onAddProduct={onAddOpen}
        isLoading={isLoading || isValidating}
      />

      <div className="container px-4 py-6 mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <BreadcrumbsBuilder items={breadcrumbItems} />
        </div>

        <div className="mb-8 animate-fade-in-up animation-delay-200">
          <StatsCards stockItems={Array.isArray(products) ? products : []} />
        </div>

        <ControlPanel
          filterCategory={filterCategory}
          setFilterCategory={handleCategoryChange}
          categories={categories}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onRefresh={handleRefresh}
          isLoading={isLoading || isValidating}
          filteredItemsCount={totalElements}
        />

        {error && <ErrorView error={error.message ?? 'Error al cargar los productos'} />}

        {isLoading ? (
          <LoadingView />
        ) : (
          <div className="animate-fade-in-up animation-delay-400">
            {Array.isArray(products) && products.length > 0 ? (
              <>
                {viewMode === 'table' ? (
                  <StockTable
                    stockItems={products}
                    onEdit={(product) => handleEditProduct(product)}
                    onDelete={(product) => handleDeleteProduct(product)}
                  />
                ) : (
                  <ProductCardsView
                    items={products}
                    onEdit={(_, item) => handleEditProduct(item)}
                    onDelete={(id) => handleDeleteProduct({ id } as any)}
                  />
                )}
                
                {/* Componente de paginación */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  isLoading={isLoading || isValidating}
                  totalElements={totalElements}
                  pageSize={PAGE_SIZE}
                />
              </>
            ) : (
              <EmptyStateView onAddProduct={onAddOpen} />
            )}
          </div>
        )}
      </div>

      <FloatingActionButton onPress={onAddOpen} isDisabled={isLoading} />

      <AddProductModal
        isOpen={isAddOpen}
        onClose={onAddClose}
        onSave={handleSaveProduct}
      />

      {selectedProduct && (
        <EditProductModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          product={{
            id: selectedProduct.id,
            name: selectedProduct.name,
            description: selectedProduct.description,
            category: selectedProduct.category,
            price: selectedProduct.price,
            quantity: selectedProduct.quantity,
            minQuantity: selectedProduct.minQuantity ?? 0,
          }}
          onSave={async (product) => {
            handleUpdateProduct(product as any);
          }}
        />
      )}

      {selectedProduct && (
        <DeleteProductModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          onDelete={handleDeleteProductConfirm}
        />
      )}
    </div>
  );
}