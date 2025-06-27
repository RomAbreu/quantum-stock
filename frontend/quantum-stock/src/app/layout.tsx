import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import '@/styles/globals.css';
import MiniGridBackground from '@/components/backgrounds/MiniGridBackground';
import Footer from '@/components/navigation/footer/Footer';
import Navbar from '@/components/navigation/navbar/Navbar';
import { NAVBAR_ITEMS } from '@/lib/constants/navbar.constants';
import { Providers } from './providers';

const onest = Onest({
	variable: '--font-onest',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Quantum Stock',
	description: 'Quantum Stock es la mejor plataforma de gestión de inventarios',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es" className="h-full">
			<body
				className={`${onest.className} flex flex-col min-h-screen antialiased scroll-smooth`}
			>
				<Providers>
					<MiniGridBackground />
					<header className="sticky top-0 z-50">
						<Navbar navbarItems={NAVBAR_ITEMS} />
					</header>
					<main className="flex flex-col flex-grow min-h-[calc(100vh-200px)]">
						{children}
					</main>
					<Footer footerItems={NAVBAR_ITEMS} />
				</Providers>
			</body>
		</html>
	);
}
