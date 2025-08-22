import { getInventoryMovementsWithPagination } from '@/lib/actions/movement.action';
import { useKeycloak } from '@react-keycloak/web';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import useSWR from 'swr';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const usePaginatedInventoryMovements = () => {
    const { keycloak, initialized } = useKeycloak();
    const searchParams = useSearchParams();
    const size = 10;
    
    // Obtener la página actual de los parámetros de URL
    const currentPage = useMemo(() => {
        const pageParam = searchParams.get('page');
        return pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
    }, [searchParams]);

    const shouldFetchMovements = initialized && keycloak.authenticated && keycloak.token;
    
    const swrKey = shouldFetchMovements
        ? `${API_URL}/api/v1/inventory-movements?page=${currentPage - 1}&size=${size}&sort=movementDate,desc`
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
                currentPage - 1, // La API espera página base 0
                size,
                'movementDate,desc',
                '',
                'all',
                keycloak.token
            );
        },
        {
            dedupingInterval: 60000,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
        }
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
        mutate();
    };

    return {
        movements,
        totalElements,
        totalPages,
        currentPage,
        error,
        isLoading: shouldFetchMovements ? isLoading : false,
        isValidating,
        refreshMovements,
        refetch: refreshMovements,
    };
};