'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Favorite } from '@/lib/types';
import { AuthGuard } from '@/components/AuthGuard';
import { MovieCard } from '@/components/MovieCard';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';

function FavoritesContent() {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFavorites = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.getFavorites();
            setFavorites(response.favorites);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load favorites');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const handleRemoveFavorite = async (movieId: number) => {
        try {
            await api.removeFavorite(movieId);
            setFavorites(favorites.filter(f => f.movie_id !== movieId));
        } catch (err) {
            console.error('Failed to remove favorite:', err);
        }
    };

    if (loading) {
        return <LoadingState message="Loading your favorites..." />;
    }

    if (error) {
        return <ErrorState message={error} onRetry={fetchFavorites} />;
    }

    if (favorites.length === 0) {
        return (
            <EmptyState
                title="No favorites yet"
                message="Start browsing and add movies you love to your favorites!"
                icon="❤️"
                action={{
                    label: "Browse Movies",
                    onClick: () => window.location.href = '/',
                }}
            />
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {favorites.map((favorite) => (
                favorite.movie && (
                    <div key={favorite.id} className="relative group">
                        <MovieCard movie={favorite.movie} />
                        <button
                            onClick={() => handleRemoveFavorite(favorite.movie_id)}
                            className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg"
                            title="Remove from favorites"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                )
            ))}
        </div>
    );
}

export default function FavoritesPage() {
    return (
        <AuthGuard>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">My Favorites</h1>
                    <p className="text-dark-400">Movies you&apos;ve loved and saved for later</p>
                </div>
                <FavoritesContent />
            </div>
        </AuthGuard>
    );
}
