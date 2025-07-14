'use client';

import { HeroUIProvider } from '@heroui/react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { useRouter } from 'next/navigation';
import { useKeycloak } from '@hooks/useKeycloak';

// @ts-ignore
declare module '@react-types/shared' {
	interface RouterConfig {
		routerOptions: NonNullable<
			Parameters<ReturnType<typeof useRouter>['push']>[1]
		>;
	}
}

export function Providers({	children,}: Readonly<{ children: React.ReactNode }>) {
	const router = useRouter();

	const { keycloak, initOptions } = useKeycloak();
	return (
		<HeroUIProvider navigate={router.push}>
			<ReactKeycloakProvider
				authClient={keycloak}
				initOptions={initOptions}
				onEvent={(event, error) => {
					console.log('[Keycloak event]', event, error);
				}}
			>
				{children}
			</ReactKeycloakProvider>
		</HeroUIProvider>
	);
}