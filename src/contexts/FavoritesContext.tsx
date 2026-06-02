'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface FavoritesContextType {
    /** Set of favorited movie IDs (empty when logged out). */
    favoriteIds: Set<number>;
    loading: boolean;
    isFavorite: (movieId: number) => boolean;
    /** Optimistically toggle; returns the new favorite state. Throws on API failure (state reverted). */
    toggleFavorite: (movieId: number) => Promise<boolean>;
    refresh: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);

    // Load the full favorites list ONCE whenever the logged-in user changes.
    // This replaces the previous per-card /favorites/{id}/check calls (N+1 storm).
    const refresh = useCallback(async () => {
        if (!user) {
            setFavoriteIds(new Set());
            return;
        }

        setLoading(true);
        try {
            const { favorites } = await api.getFavorites();
            setFavoriteIds(new Set(favorites.map((f) => f.movie_id)));
        } catch {
            // Not logged in / transient error — treat as no favorites.
            setFavoriteIds(new Set());
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const isFavorite = useCallback(
        (movieId: number) => favoriteIds.has(movieId),
        [favoriteIds]
    );

    const toggleFavorite = useCallback(
        async (movieId: number): Promise<boolean> => {
            const currentlyFavorite = favoriteIds.has(movieId);
            const nextFavorite = !currentlyFavorite;

            // Optimistic update (immutable: build a new Set).
            setFavoriteIds((prev) => {
                const next = new Set(prev);
                if (nextFavorite) {
                    next.add(movieId);
                } else {
                    next.delete(movieId);
                }
                return next;
            });

            try {
                if (nextFavorite) {
                    await api.addFavorite(movieId);
                } else {
                    await api.removeFavorite(movieId);
                }
                return nextFavorite;
            } catch (error) {
                // Revert on failure.
                setFavoriteIds((prev) => {
                    const next = new Set(prev);
                    if (nextFavorite) {
                        next.delete(movieId);
                    } else {
                        next.add(movieId);
                    }
                    return next;
                });
                throw error;
            }
        },
        [favoriteIds]
    );

    return (
        <FavoritesContext.Provider
            value={{ favoriteIds, loading, isFavorite, toggleFavorite, refresh }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}
