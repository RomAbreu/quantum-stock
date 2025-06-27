import 'server-only';
import { type JWTPayload, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = 'access_token_secret_key_that_should_be_in_env_vars';
const encodedKey = new TextEncoder().encode(secretKey);

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function createSession(payload: any) {
	const cookieStore = await cookies();

	cookieStore.set('session', payload, {
		httpOnly: true,
		secure: true,
		expires: payload.exp,
		sameSite: 'lax',
		path: '/',
	});
}

export async function deleteSession() {
	const cookieStore = await cookies();
	cookieStore.delete('session');
}

export async function decrypt(
	jwt: string | undefined = '',
): Promise<JWTPayload | Error> {
	try {
		const { payload } = await jwtVerify(jwt, encodedKey, {
			algorithms: ['HS256'],
		});
		return payload;
	} catch (error) {
		return new Error(`Invalid session ${error}`);
	}
}
