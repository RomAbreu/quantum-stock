'use client';

import ConfirmPasswordInput from '@/components/inputs/ConfirmPasswordInput';
import PasswordInput from '@/components/inputs/PasswordInput';
import { register } from '@/lib/actions/register.action';
import { Button } from '@heroui/button';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { useActionState } from 'react';

export default function RegisterForm() {
	const [{ errors }, formAction, pending] = useActionState(register, {
		errors: {
			email: '',
			password: '',
		},
	});

	return (
		<Form className="flex flex-col w-full gap-3" action={formAction}>
			{/* Name fields in a single row */}
			<div className="flex w-full gap-2">
				<Input
					label="First Name"
					name="first_name"
					placeholder="Enter your first name"
					variant="flat"
				/>
				<Input
					label="Last Name"
					name="last_name"
					placeholder="Enter your last name"
					variant="flat"
				/>
			</div>

			<Input
				label="Email Address"
				name="email"
				placeholder="Enter your email"
				type="email"
				variant="flat"
			/>
			<PasswordInput />
			{/* <ConfirmPasswordInput /> */}

			<Button className="w-full text-white" color="primary" type="submit">
				Sign Up
			</Button>
		</Form>
	);
}
