import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import '@/styles/globals.css';
import MiniGridBackground from '@/components/backgrounds/MiniGridBackground';
import Footer from '@/components/navigation/footer/Footer';
import Navbar from '@/components/navigation/navbar/Navbar';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

const onest = Onest({
    variable: '--font-onest',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Quantum Stock',
    description: 'Quantum Stock es la mejor plataforma de gestión de inventarios',
};

export default async function RootLayout({
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
                        <Navbar />
                    </header>
                    <main className="flex flex-col flex-grow min-h-[calc(100vh-200px)]">
                        {children}
                    </main>
                    <Footer />
                    <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 4000,
                                style: {
                                background: 'white',
                                color: 'black',
                                border: '1px solid #e5e5e5',
                                borderRadius: '8px',
                                fontSize: '14px',
                                maxWidth: '500px',
                                },
                                success: {
                                style: {
                                    border: '1px solid #10b981',
                                    color: '#10b981',
                                },
                                },
                                error: {
                                style: {
                                    border: '1px solid #ef4444',
                                    color: '#ef4444',
                                },
                                },
                            }}
                            />
                </Providers>
            </body>
        </html>
    );
}