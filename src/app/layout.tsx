import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Moviemind - Discover Movies You\'ll Love',
    description: 'AI-powered film recommendation platform with transparent suggestions',
    keywords: ['movies', 'recommendations', 'films', 'streaming'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1">
                            {children}
                        </main>
                        <footer className="py-6 text-center text-dark-400 border-t border-dark-800">
                            <p>© 2024 Moviemind. Built with ❤️ for Software Quality Standards.</p>
                        </footer>
                    </div>
                </AuthProvider>
            </body>
        </html>
    );
}
