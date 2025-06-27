'use client';

import { Divider, Image, Link, Spacer } from '@heroui/react';
import type { IconProps } from '@iconify/react';
import { Icon } from '@iconify/react';
import { type NavbarLink, NavbarLinks } from '@lib/constants/navbar.constants';
import React from 'react';

type SocialIconProps = Omit<IconProps, 'icon'>;

const CURRENT_YEAR = new Date().getFullYear();

// Enlaces de redes sociales
const socialLinks = [
	{ icon: 'mdi:twitter', href: 'https://twitter.com/' },
	{ icon: 'mdi:linkedin', href: 'https://linkedin.com/' },
	{ icon: 'mdi:github', href: 'https://github.com/' },
];

type FooterProps = {
	footerItems?: NavbarLink[];
};

export default function Footer({ footerItems }: Readonly<FooterProps>) {
	return (
		<footer className="relative z-10 w-full py-8 mt-auto bg-gray-900">
			<div className="container px-4 mx-auto">
				<div className="flex flex-col items-center">
					<div className="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-4">
						{/* Columna de logo */}
						<div className="flex flex-col items-center md:items-start">
							<Link href={NavbarLinks.HOME}>
								<Image
									src="/images/logo.png"
									alt="QuantumStock Logo"
									className="w-auto h-16 mb-4 drop-shadow-lg"
									width="auto"
									height={140}
									radius="none"
									classNames={{
										img: 'object-contain',
									}}
								/>
							</Link>
						</div>

						{/* Navegación */}
						<div className="flex flex-col items-center md:items-start">
							<h3 className="mb-4 text-lg font-bold text-white">Navegación</h3>
							<div className="flex flex-col gap-2">
								{footerItems?.slice(0, 5).map((item) => (
									<Link
										key={item.label}
										className="font-medium transition-colors text-default-300 hover:text-white"
										href={item.href}
										size="sm"
									>
										{item.label}
									</Link>
								))}
							</div>
						</div>

						{/* Recursos */}
						<div className="flex flex-col items-center md:items-start">
							<h3 className="mb-4 text-lg font-bold text-white">Recursos</h3>
							<div className="flex flex-col gap-2">
								<Link
									className="font-medium transition-colors text-default-300 hover:text-white"
									href="/documentacion"
									size="sm"
								>
									Documentación
								</Link>
								<Link
									className="font-medium transition-colors text-default-300 hover:text-white"
									href="/soporte"
									size="sm"
								>
									Soporte Técnico
								</Link>
								<Link
									className="font-medium transition-colors text-default-300 hover:text-white"
									href="/politicas"
									size="sm"
								>
									Políticas de Calidad
								</Link>
							</div>
						</div>

						{/* Contacto */}
						<div className="flex flex-col items-center md:items-start">
							<h3 className="mb-4 text-lg font-bold text-white">Contacto</h3>
							<p className="mb-4 text-sm text-default-300">
								PUCMM - Escuela de Computación
								<br />
								quantumstock@pucmm.edu.do
								<br />
								+1 (809) 123-4567
							</p>

							<div className="flex gap-4 mt-2">
								{socialLinks.map((link) => (
									<Link
										key={link.icon}
										isExternal
										href={link.href}
										className="transition-all text-default-300 hover:text-white hover:scale-110"
									>
										<Icon icon={link.icon} width={24} height={24} />
									</Link>
								))}
							</div>
						</div>
					</div>

					<Spacer y={6} />
					<Divider className="w-full max-w-5xl bg-white/20" />
					<Spacer y={4} />

					<p className="text-sm text-center text-default-300">
						&copy; {CURRENT_YEAR} QuantumStock — Sistema de Gestión de
						Inventarios. Todos los derechos reservados.
					</p>
				</div>
			</div>
		</footer>
	);
}
