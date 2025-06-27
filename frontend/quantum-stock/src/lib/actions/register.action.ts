'use server';

import { API_URL } from '@lib/constants/api.constants';
import { EndpointEnum } from '@lib/constants/endpoints.constants';

import { createSession } from '@/lib/actions/session.action';
import { redirect } from 'next/navigation';

const REGISTER_ENDPOINT = EndpointEnum.Register;
const REGISTER_URL = `${API_URL}${REGISTER_ENDPOINT}`;

const HEADERS = {
	'Content-Type': 'application/json',
};

type RegisterDTO = {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	//role: string;
};

type RegisterResponse = {
	token: string;
};

const manageError = (error: unknown) => {
	if (error instanceof Error) {
		return {
			errors: {
				first_name: error.message,
				last_name: error.message,
				email: error.message,
				password: error.message,
				//confirmPassword: error.message,
			},
		};
	}

	if (error === 'string') {
		return {
			errors: {
				first_name: error,
				last_name: error,
				email: error,
				password: error,
				//confirmPassword: error,
			},
		};
	}

	return {
		errors: {
			email: 'An unknown error occurred',
			password: 'An unknown error occurred',
		},
	};
};

export async function register(prevState: unknown, formData: FormData) {
	try {
		const registerDTO: RegisterDTO = {
			first_name: formData.get('first_name') as string,
			last_name: formData.get('last_name') as string,
			email: formData.get('email') as string,
			password: formData.get('password') as string,
			//role: 'USER',
		};

		const response = await fetch(REGISTER_URL, {
			method: 'POST',
			headers: HEADERS,
			body: JSON.stringify(registerDTO),
		});

		console.log({ response });

		if (response.status === 401) {
			const unauthorizedResponse: any = await response.json();
			return {
				errors: {
					first_name: unauthorizedResponse.message,
					last_name: unauthorizedResponse.message,
					email: unauthorizedResponse.message,
					password: unauthorizedResponse.message,
					//confirmPassword: unauthorizedResponse.message,
				},
			};
		}

		const authorizedResult: RegisterResponse = await response.json();
		await createSession(authorizedResult.token);
		console.log('Registration successful, session created.');
	} catch (error: unknown) {
		return manageError(error);
	}
	redirect('/');
}
