export const NEXT_API_URL =
	process.env.NEXT_PUBLIC_API_URL ?? 'https://api.quantum-stock.rabreus.tech/api/v1';

export const NEXT_KEYCLOAK_URL =
	process.env.NEXT_PUBLIC_KEYCLOAK_URL ?? 'https://auth.quantum-stock.rabreus.tech';

export const NEXT_KEYCLOAK_AUTH_URL: string =
	process.env.NEXT_PUBLIC_KEYCLOAK_AUTH_URL ??
	'https://auth.quantum-stock.rabreus.tech/realms/quantum-stock/account';

export const NEXT_KEYCLOAK_REALM =
	process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? 'quantum-stock';

export const NEXT_KEYCLOAK_CLIENT_ID =
	process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? 'quantum-stock-frontend';
