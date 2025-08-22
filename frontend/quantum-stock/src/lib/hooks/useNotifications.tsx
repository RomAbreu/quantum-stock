import { fetchNotifications } from '@/lib/actions/notification.action';
import type MinQuantityNotification from '@/lib/model/notification.model';
import { useKeycloak } from '@react-keycloak/web';
import { useMemo } from 'react';
import useSWR from 'swr';

export const useNotifications = () => {
	const { keycloak } = useKeycloak();

	const shouldFetch = useMemo(
		() => keycloak.authenticated && keycloak.token,
		[keycloak.authenticated, keycloak.token],
	);

	const swrKey = useMemo(
		() => (shouldFetch ? ['notifications', keycloak.token] : null),
		[shouldFetch, keycloak.token],
	);

	const { data, error, isLoading, mutate } = useSWR<MinQuantityNotification[]>(
		swrKey,
		([_key, token]: [string, string]) => fetchNotifications(token),
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			errorRetryCount: 3,
			errorRetryInterval: 5000,
			dedupingInterval: 2000,
		},
	);

	return {
		notifications: data || [],
		isLoading: shouldFetch ? isLoading : false,
		isError: error,
		mutate,
		refetch: () => mutate(),
	};
};
