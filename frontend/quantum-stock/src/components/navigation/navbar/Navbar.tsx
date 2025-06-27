'use client';

import {
	Button,
	Navbar as HeroNavbar,
	Image,
	Link,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { type NavbarLink, NavbarLinks } from '@lib/constants/navbar.constants';
import { useState } from 'react';

type NavbarProps = {
	navbarItems?: NavbarLink[];
};

export default function Navbar({ navbarItems }: Readonly<NavbarProps>) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Filter out login and signup from main navigation items since they're shown as buttons
	const mainNavItems =
		navbarItems?.filter(
			(item) =>
				item.href !== NavbarLinks.LOGIN && item.href !== NavbarLinks.SIGNUP,
		) || [];

	return (
		<HeroNavbar
			position="sticky"
			className="bg-gray-900 border-gray-700" // preguntarle a romario si esto le gusta o lo quito
			classNames={{
				wrapper: 'bg-gray-900',
				content: 'text-white',
				brand: 'text-white',
				item: 'text-white data-[active=true]:text-white',
				toggle: 'text-white',
				menu: 'bg-gray-900 border-gray-700',
			}}
			isBordered
			onMenuOpenChange={setIsMenuOpen}
		>
			<NavbarContent>
				<NavbarMenuToggle
					aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
					className="sm:hidden"
				/>

				<NavbarBrand as={Link} href={NavbarLinks.HOME}>
					<Image
						src="/images/banner_sin_fondo.png"
						alt="Quantum Stock Logo"
						width={70}
						height={70}
						className="rounded-full"
					/>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className="hidden sm:flex" justify="center">
				{mainNavItems?.map((item: NavbarLink) => (
					<NavbarItem key={item.label}>
						<Link
							href={item.href}
							className="flex items-center gap-1 transition hover:scale-110"
						>
							{item.icon}
							{item.label}
						</Link>
					</NavbarItem>
				))}
			</NavbarContent>

			<NavbarContent className="hidden sm:flex" justify="end">
				<NavbarItem className="!flex gap-2">
					<Button
						as={Link}
						href={NavbarLinks.LOGIN}
						className="text-default-500"
						radius="full"
						variant="light"
					>
						Login
					</Button>
					<Button
						as={Link}
						href={NavbarLinks.SIGNUP}
						color="primary"
						endContent={<Icon icon="solar:alt-arrow-right-linear" />}
						radius="full"
						variant="flat"
						className="font-semibold"
					>
						Register
					</Button>
				</NavbarItem>
			</NavbarContent>

			<NavbarMenu>
				{mainNavItems?.map((item: NavbarLink) => (
					<NavbarMenuItem key={item.label}>
						<Link href={item.href} className="flex items-center gap-2">
							{item.icon}
							{item.label}
						</Link>
					</NavbarMenuItem>
				))}
				<NavbarMenuItem>
					<Link href={NavbarLinks.LOGIN} className="flex items-center gap-2">
						Login
					</Link>
				</NavbarMenuItem>
				<NavbarMenuItem>
					<Link href={NavbarLinks.SIGNUP} className="flex items-center gap-2">
						Register
					</Link>
				</NavbarMenuItem>
			</NavbarMenu>
		</HeroNavbar>
	);
}
