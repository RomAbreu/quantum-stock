'use client';

import { HeroUIProvider } from '@heroui/react';
import { useRouter } from 'next/navigation';

// @ts-ignore
declare module '@react-types/shared' {
	interface RouterConfig {
		routerOptions: NonNullable<
			Parameters<ReturnType<typeof useRouter>['push']>[1]
		>;
	}
}

export function Providers({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const router = useRouter();
	return <HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>;
}
