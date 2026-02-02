import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Language Coach',
    description: 'Minimal text-only language practice',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} min-h-screen lg:h-screen flex flex-col items-center justify-center p-4 md:p-6 bg-brand-gray lg:overflow-hidden`}>
                <main className="w-full max-w-lg md:max-w-3xl lg:max-w-6xl bg-white rounded-3xl p-6 md:p-8 lg:p-12 h-auto lg:h-full lg:max-h-[900px] flex flex-col transition-all duration-300">
                    {children}
                </main>
            </body>
        </html>
    );
}
