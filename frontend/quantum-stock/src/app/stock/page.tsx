'use client';

import { useState } from 'react';
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
  // Basic search state (temporary until you implement your solution)
  const [searchTerm, setSearchTerm] = useState('');

  const {
    products,
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
    refreshProducts, // ← Usar la función de refresh del hook
  } = useStockPage();

  const handleSaveProduct = async (newProduct: Product) => {
    console.log('Product saved successfully:', newProduct);
    // Trigger refetch after saving new product
    refreshProducts();
  };

  // Simple refresh function - will be expanded later
  const handleRefresh = () => {
    refreshProducts();
  };

  if (isAuthChecking) {
    return <LoadingView message="Verificando autenticación..." />;
  }

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
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={'all'}
          setFilterCategory={() => {}}
          categories={[]}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onRefresh={handleRefresh}
          isLoading={isLoading || isValidating}
          filteredItemsCount={Array.isArray(products) ? products.length : 0}
        />

        {error && <ErrorView error={error.message ?? 'Error al cargar los productos'} />}

        {isLoading ? (
          <LoadingView />
        ) : (
          <div className="animate-fade-in-up animation-delay-400">
            {Array.isArray(products) && products.length > 0 ? (
              viewMode === 'table' ? (
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
              )
            ) : (
              <EmptyStateView onAddProduct={onAddOpen} />
            )}
          </div>
        )}
      </div>

      <FloatingActionButton onPress={onAddOpen} isDisabled={isLoading} />

      {/* Modals centralizados */}
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