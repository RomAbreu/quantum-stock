import useSWR from 'swr';
import { useKeycloak } from '@react-keycloak/web';
import { useMemo } from 'react';
import type MinQuantityNotification from '@/lib/model/notification.model';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

const fetcher = async (url: string, token?: string) => {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    
    const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};

export const useNotifications = () => {
    const { keycloak } = useKeycloak();
    
    // FIX: Memoizar valores para evitar re-renders
    const shouldFetch = useMemo(() => 
        keycloak.authenticated && keycloak.token, 
        [keycloak.authenticated, keycloak.token]
    );
    
    const swrKey = useMemo(() => 
        shouldFetch ? ['/api/v1/min-quantity-notifications', keycloak.token] : null,
        [shouldFetch, keycloak.token]
    );
    
    const { data, error, isLoading, mutate } = useSWR<MinQuantityNotification[]>(
        swrKey,
        ([url, token]: [string, string]) => fetcher(url, token),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            errorRetryCount: 3,
            errorRetryInterval: 5000,
            dedupingInterval: 2000,
        }
    );

    return {
        notifications: data || [],
        isLoading: shouldFetch ? isLoading : false,
        isError: error,
        mutate,
        refetch: () => mutate()
    };
};