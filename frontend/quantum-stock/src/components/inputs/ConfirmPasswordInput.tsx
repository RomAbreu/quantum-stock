'use client';

import { Input } from '@heroui/input';
import { Icon } from '@iconify/react';
import React from 'react';

interface PasswordInputProps {
	label?: string;
	name?: string;
	placeholder?: string;
	variant?: 'flat' | 'bordered' | 'faded' | 'underlined';
	className?: string;
}

export default function PasswordInput({
	label = 'Confirm Password',
	name = 'confirmPassword',
	placeholder = 'Confirm your password',
	variant = 'flat',
	className = '',
}: Readonly<PasswordInputProps>) {
	const [isVisible, setIsVisible] = React.useState(false);

	const toggleVisibility = () => setIsVisible(!isVisible);

	return (
		<Input
			endContent={
				<button type="button" onClick={toggleVisibility}>
					{isVisible ? (
						<Icon
							className="text-2xl pointer-events-none text-default-800"
							icon="solar:eye-closed-linear"
						/>
					) : (
						<Icon
							className="text-2xl pointer-events-none text-default-800"
							icon="solar:eye-bold"
						/>
					)}
				</button>
			}
			label={label}
			name={name}
			placeholder={placeholder}
			type={isVisible ? 'text' : 'password'}
			variant={variant}
			className={className}
		/>
	);
}
