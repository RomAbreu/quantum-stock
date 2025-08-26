import { getInventoryMovementsWithPagination, getAllInventoryMovements } from '@/lib/actions/movement.action';
import { useKeycloak } from '@react-keycloak/web';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import useSWR from 'swr';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const usePaginatedInventoryMovements = () => {
    const { keycloak, initialized } = useKeycloak();
    const searchParams = useSearchParams();
    const size = 10;

    const currentPage = useMemo(() => {
        const pageParam = searchParams.get('page');
        return pageParam ? Math.max(1, Number.parseInt(pageParam, 10)) : 1;
    }, [searchParams]);

    const shouldFetchMovements =
        initialized && keycloak.authenticated && keycloak.token;

    const swrKey = shouldFetchMovements
        ? `${API_URL}/inventory-movements?page=${currentPage - 1}&size=${size}`
        : null;

    const { data, error, isLoading, isValidating, mutate } = useSWR(
        swrKey,
        () => {
            if (!keycloak.token) {
                return Promise.resolve({
                    content: [],
                    totalElements: 0,
                    totalPages: 0,
                });
            }
            return getInventoryMovementsWithPagination(
                currentPage - 1,
                size,
                keycloak.token,
            );
        },
        {
            dedupingInterval: 30000, // Reducido para mejor reactividad
            revalidateOnFocus: false,
            revalidateOnReconnect: true, // Cambiado a true para recargar al reconectar
            revalidateIfStale: true, // Cambiado a true para revalidar datos obsoletos
        },
    );

    const normalizeData = () => {
        if (data && 'content' in data) {
            return {
                movements: data.content ?? [],
                totalElements: data.totalElements ?? 0,
                totalPages: data.totalPages ?? 0,
            };
        }
        return {
            movements: [],
            totalElements: 0,
            totalPages: 0,
        };
    };

    const { movements, totalElements, totalPages } = normalizeData();

    const refreshMovements = () => {
        console.log('🔄 Refrescando movimientos...');
        mutate();
    };

    return {
        movements,
        totalElements,
        totalPages,
        currentPage,
        pageSize: size,
        error,
        isLoading: shouldFetchMovements ? isLoading : false,
        isValidating,
        refreshMovements,
        refetch: refreshMovements,
    };
};

export const useInventoryMovements = () => {
    const { keycloak, initialized } = useKeycloak();

    const shouldFetchMovements =
        initialized && keycloak.authenticated && keycloak.token;

    const swrKey = shouldFetchMovements
        ? `${API_URL}/inventory-movements`
        : null;

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        () => {
            if (!keycloak.token) {
                return Promise.resolve([]);
            }
            return getAllInventoryMovements(keycloak.token, 1000);
        },
        {
            dedupingInterval: 300000,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    );

    return {
        movements: data || [],
        error,
        isLoading: shouldFetchMovements ? isLoading : false,
        refetch: mutate,
    };
};