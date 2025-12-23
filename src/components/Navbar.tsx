'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export function Navbar() {
    const { user, signOut, loading } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="glass sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl">🎬</span>
                        <span className="text-xl font-bold gradient-text">Moviemind</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/"
                            className="text-dark-200 hover:text-white transition-colors"
                        >
                            Browse
                        </Link>
                        {user && (
                            <Link
                                href="/favorites"
                                className="text-dark-200 hover:text-white transition-colors"
                            >
                                Favorites
                            </Link>
                        )}
                        {user && (
                            <Link
                                href="/recommendations"
                                className="text-dark-200 hover:text-white transition-colors"
                            >
                                Recommendations
                            </Link>
                        )}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {loading ? (
                            <div className="w-20 h-10 skeleton rounded-xl" />
                        ) : user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-dark-300 text-sm">{user.email}</span>
                                <button
                                    onClick={() => signOut()}
                                    className="btn-secondary text-sm"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className="btn-secondary text-sm">
                                    Login
                                </Link>
                                <Link href="/register" className="btn-primary text-sm">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-dark-200 hover:text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-dark-700">
                        <div className="flex flex-col space-y-4">
                            <Link
                                href="/"
                                className="text-dark-200 hover:text-white transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Browse
                            </Link>
                            {user && (
                                <Link
                                    href="/favorites"
                                    className="text-dark-200 hover:text-white transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Favorites
                                </Link>
                            )}
                            {user && (
                                <Link
                                    href="/recommendations"
                                    className="text-dark-200 hover:text-white transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Recommendations
                                </Link>
                            )}
                            {user ? (
                                <button
                                    onClick={() => {
                                        signOut();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-left text-dark-200 hover:text-white transition-colors"
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-dark-200 hover:text-white transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="text-primary-400 hover:text-primary-300 transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
