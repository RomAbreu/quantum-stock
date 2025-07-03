import type Product from '@/lib/model/product.model';
import { useKeycloak } from '@react-keycloak/web';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EndpointEnum } from '@/lib/constants/routes.constants';
import useSWR from 'swr';
import { fetcher } from '@/lib/swr/fetcher';
import { useDisclosure } from '@heroui/react';

type ProductResponseDTO = {
    content: Product[];
    page: number;
    size: number;
};

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export function useStockPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { keycloak, initialized } = useKeycloak();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isEditOpen,
        onOpen: onEditOpen,
        onClose: onEditClose,
    } = useDisclosure();

    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose,
    } = useDisclosure();

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        onEditOpen();
    };

    const handleDeleteProduct = (product: Product) => {
        setSelectedProduct(product);
        onDeleteOpen();
    };

    const handleUpdateProduct = (updateProduct: Product) => {
        console.log('Update product:', updateProduct);
        // Trigger refetch after update
        mutate();
    };

    const handleDeleteProductConfirm = (productId: string) => {
        console.log('Delete product with ID:', productId);
        // Trigger refetch after delete
        mutate();
    };

    useEffect(() => {
        if (!initialized) {
            setIsAuthChecking(true);
            return;
        }

        const checkAuthandPermissions = async () => {
            try {
                if (!keycloak.authenticated) {
                    sessionStorage.setItem(
                        'redirectAfterLogin', 
                        window.location.pathname,
                    );

                    keycloak.login({
                        redirectUri: window.location.origin + EndpointEnum.Stock,
                    });
                    return;
                }

                const hasAdminRole = 
                    keycloak.resourceAccess?.['quantum-stock-frontend']?.roles?.includes(
                        'admin',
                    );

                if (!hasAdminRole) {
                    router.push(EndpointEnum.Home);
                    return;
                }

                setIsAuthChecking(false);
            } catch (error) {
                console.error('Error checking authentication and permissions:', error);
                setIsAuthChecking(false);
            }
        };

        checkAuthandPermissions();
    }, [initialized, keycloak, router]);

    const shouldFetchProducts = !isAuthChecking && initialized && keycloak.authenticated;

    const query = searchParams.get('query');
    const category = searchParams.get('category');
    const page = searchParams.get('page');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const swrKey = shouldFetchProducts 
        ? `${API_URL}/products/all?${new URLSearchParams({
            search: query ?? '',
            category: category ?? '',
            page: (page && !Number.isNaN(Number(page))
            ? Number(page) -1
            : 0
        ).toString(),
        minPrice: minPrice ?? '',
        maxPrice: maxPrice ?? '',
        }).toString()}`
        : null;

    const {
        data: products = {},
        error,
        isLoading,
        isValidating,
        mutate, // ← Agregar mutate aquí
    } = useSWR<ProductResponseDTO>(
        swrKey,
        fetcher,
        {
            dedupingInterval: 60000, // 1 minute
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
        },
    );

    // Función para refrescar los datos
    const refreshProducts = () => {
        mutate();
    };

    return {
        selectedProduct,
        setSelectedProduct,
        handleEditProduct,
        handleDeleteProduct,
        handleUpdateProduct,
        handleDeleteProductConfirm,
        isOpen,
        onOpen,
        onClose,
        isEditOpen,
        onEditOpen,
        onEditClose,
        isDeleteOpen,
        onDeleteOpen,
        onDeleteClose,
        products,
        error,
        isLoading,
        isValidating,
        isAuthChecking,
        refreshProducts, // ← Exportar la función de refresh
    };
}