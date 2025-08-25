import { EndpointEnum } from '@/lib/constants/routes.constants';
import type Product from '@/lib/model/product.model';
import { fetcher } from '@/lib/swr/fetcher';
import { useDisclosure } from '@heroui/react';
import { useKeycloak } from '@react-keycloak/web';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

type ProductResponseDTO =
    | {
            content?: Product[];
            page?: number;
            size?: number;
            totalElements?: number;
            totalPages?: number;
      }
    | Product[];

type UseStockPageParams = {
    query?: string;
    page?: number;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    size?: number;
};

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export function useStockPage(params?: UseStockPageParams) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { keycloak, initialized } = useKeycloak();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    const [userRole, setUserRole] = useState<
        'admin' | 'employee' | 'regular' | 'none'
    >('none');
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
        if (userRole === 'admin' || userRole === 'employee') {
            setSelectedProduct(product);
            onEditOpen();
        }
    };

    const handleDeleteProduct = (product: Product) => {
        if (userRole === 'admin') {
            setSelectedProduct(product);
            onDeleteOpen();
        }
    };

    const handleUpdateProduct = (updateProduct: Product) => {
        console.log('Update product:', updateProduct);
        mutate();
    };

    const handleDeleteProductConfirm = (productId: string) => {
        console.log('Delete product with ID:', productId);
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
                    setUserRole('none');
                    setIsAuthChecking(false);
                    return;
                }

                const roles =
                    keycloak.resourceAccess?.['quantum-stock-frontend']?.roles || [];

                if (roles.includes('admin')) {
                    setUserRole('admin');
                } else if (roles.includes('employee')) {
                    setUserRole('employee');
                } else {
                    setUserRole('regular');
                }

                setIsAuthChecking(false);
            } catch (error) {
                console.error('Error checking authentication and permissions:', error);
                setIsAuthChecking(false);
            }
        };

        checkAuthandPermissions();
    }, [initialized, keycloak]);

    const shouldFetchProducts = !isAuthChecking && initialized;

    const query = params?.query ?? searchParams.get('query');
    const category = params?.category ?? searchParams.get('category');
    const page = params?.page ?? searchParams.get('page');
    const minPrice = params?.minPrice ?? searchParams.get('minPrice');
    const maxPrice = params?.maxPrice ?? searchParams.get('maxPrice');
    const size = params?.size ?? 10;

    const buildSearchParams = () => {
        const urlParams = new URLSearchParams();

        if (query?.trim()) {
            urlParams.append('name', query.trim());
        }

        if (category && category !== 'all') {
            urlParams.append('category', category);
        }

        if (minPrice?.trim()) {
            urlParams.append('minPrice', minPrice.trim());
        }

        if (maxPrice?.trim()) {
            urlParams.append('maxPrice', maxPrice.trim());
        }

        const pageNumber =
            page && !Number.isNaN(Number(page)) ? Number(page) - 1 : 0;
        urlParams.append('page', pageNumber.toString());
        urlParams.append('size', size.toString());

        urlParams.append('sort', 'id,asc');

        return urlParams.toString();
    };

    const swrKey = shouldFetchProducts
        ? `${API_URL}/products/all?${buildSearchParams()}`
        : null;

    console.log('Generated SWR Key:', swrKey);

    const {
        data: responseData,
        error,
        isLoading,
        isValidating,
        mutate,
    } = useSWR<ProductResponseDTO>(swrKey, fetcher, {
        dedupingInterval: 60000,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
    });

    const normalizeData = () => {
        if (Array.isArray(responseData)) {
            return {
                products: responseData,
                totalElements: responseData.length,
                totalPages: 1,
                currentPage: 0,
            };
        }

        if (responseData && 'content' in responseData) {
            return {
                products: responseData.content ?? [],
                totalElements: responseData.totalElements ?? 0,
                totalPages: responseData.totalPages ?? 0,
                currentPage: responseData.page ?? 0,
            };
        }

        return {
            products: [],
            totalElements: 0,
            totalPages: 0,
            currentPage: 0,
        };
    };

    const { products, totalElements, totalPages, currentPage } = normalizeData();

    const refreshProducts = () => {
        mutate();
    };

    const hasEditAccess = userRole === 'admin' || userRole === 'employee';
    const hasDeleteAccess = userRole === 'admin';
    const isAuthenticated = keycloak.authenticated;

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
        totalElements,
        totalPages,
        currentPage,
        error,
        isLoading,
        isValidating,
        isAuthChecking,
        refreshProducts,
        userRole,
        hasEditAccess,
        hasDeleteAccess,
        isAuthenticated,
    };
}