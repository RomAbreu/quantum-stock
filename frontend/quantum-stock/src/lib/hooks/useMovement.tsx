import { getAllInventoryMovements } from '@/lib/actions/movement.action';
import type InventoryMovement from '@/lib/model/movement.model';
import { useKeycloak } from '@react-keycloak/web';
import { useMemo } from 'react';
import useSWR from 'swr';

export const useInventoryMovements = () => {
	const { keycloak } = useKeycloak();

	const shouldFetch = useMemo(
		() => keycloak.authenticated && keycloak.token,
		[keycloak.authenticated, keycloak.token],
	);

	const swrKey = useMemo(
		() => (shouldFetch ? ['inventory-movements', keycloak.token] : null),
		[shouldFetch, keycloak.token],
	);

	const { data, error, isLoading, mutate } = useSWR<InventoryMovement[]>(
		swrKey,
		() =>
			keycloak.token
				? getAllInventoryMovements(keycloak.token)
				: Promise.resolve([]),
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			errorRetryCount: 3,
			errorRetryInterval: 5000,
			dedupingInterval: 2000,
		},
	);

	return {
		movements: data || [],
		isLoading: shouldFetch ? isLoading : false,
		isError: error,
		mutate,
		refetch: () => mutate(),
	};
};
/*
export const usePaginatedInventoryMovements = (
    page: number = 0,
    size: number = 10,
    sort: string = 'movementDate,desc'
) => {
    const { keycloak } = useKeycloak();
   
    const shouldFetch = useMemo(() =>
        keycloak.authenticated && keycloak.token,
        [keycloak.authenticated, keycloak.token]
    );
   
    const swrKey = useMemo(() =>
        shouldFetch ? ['inventory-movements-paginated', page, size, sort, keycloak.token] : null,
        [shouldFetch, page, size, sort, keycloak.token]
    );
   
    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        () => keycloak.token ? 
            getInventoryMovementsWithPagination(page, size, sort, keycloak.token) : 
            Promise.resolve({
                content: [],
                totalElements: 0,
                totalPages: 0
            }),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            errorRetryCount: 3,
            errorRetryInterval: 5000,
            dedupingInterval: 2000,
        }
    );
    
    return {
        movements: data?.content || [],
        totalElements: data?.totalElements || 0,
        totalPages: data?.totalPages || 0,
        isLoading: shouldFetch ? isLoading : false,
        isError: error,
        mutate,
        refetch: () => mutate()
    };
};
*/
