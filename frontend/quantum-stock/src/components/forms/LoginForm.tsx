'use client';

import PasswordInput from '@/components/inputs/PasswordInput';
import { logIn } from '@/lib/actions/login.action';
import { Button } from '@heroui/button';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { useActionState } from 'react';

export default function LoginForm() {
	const [{ errors }, formAction, pending] = useActionState(logIn, {
		errors: {
			email: '',
			password: '',
		},
	});

	return (
		<Form className="flex flex-col w-full gap-3" action={formAction}>
			<Input
				label="Email"
				name="email"
				placeholder="Enter your email"
				type="text"
				variant="flat"
			/>
			<PasswordInput />
			<Button className="w-full text-white" color="primary" type="submit">
				Log In
			</Button>
		</Form>
	);
}
