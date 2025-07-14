import {
	NEXT_KEYCLOAK_CLIENT_ID,
	NEXT_KEYCLOAK_REALM,
	NEXT_KEYCLOAK_URL,
} from '@lib/constants/config.constants';
import Keycloak from 'keycloak-js';
import { useMemo, useState } from 'react';

export function useKeycloak() {
	const [keycloak] = useState(
		() =>
			new Keycloak({
				url: NEXT_KEYCLOAK_URL,
				realm: NEXT_KEYCLOAK_REALM,
				clientId: NEXT_KEYCLOAK_CLIENT_ID,
			}),
	);

	const initOptions = useMemo(() => {
		const baseOptions = {
			pkceMethod: 'S256' as const,
			onLoad: 'check-sso' as const,
			checkLoginIframe: false,
		};

		if (typeof window !== 'undefined') {
			return {
				...baseOptions,
			};
		}

		return baseOptions;
	}, []);

	return {
		keycloak,
		initOptions,
	};
}
