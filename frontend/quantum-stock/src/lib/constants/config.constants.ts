export const NEXT_API_URL =
	process.env.NEXT_API_URL ?? 'http://localhost:8080/api/v1';

export const NEXT_PUBLIC_API_URL =
	process.env.NEXT_API_URL ?? 'http://localhost:8080/api/v1';

export const NEXT_KEYCLOAK_URL =
	process.env.NEXT_KEYCLOAK_URL ?? 'http://localhost:9090';

export const NEXT_KEYCLOAK_AUTH_URL: string =
	process.env.NEXT_KEYCLOAK_AUTH_URL ??
	'http://localhost:9090/realms/quantum-stock/account';

export const NEXT_KEYCLOAK_REALM =
	process.env.NEXT_KEYCLOAK_REALM ?? 'quantum-stock';

export const NEXT_KEYCLOAK_CLIENT_ID =
	process.env.NEXT_KEYCLOAK_CLIENT_ID ?? 'quantum-stock-frontend';
