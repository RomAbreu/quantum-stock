import { NEXT_KEYCLOAK_AUTH_URL } from './config.constants';

export const EndpointEnum = {
	Home: '/',
	Login: NEXT_KEYCLOAK_AUTH_URL,
	Stock: '/stock',
	Dashboard: '/dashboard',
} as const;

export type EndpointEnumType = (typeof EndpointEnum)[keyof typeof EndpointEnum];
