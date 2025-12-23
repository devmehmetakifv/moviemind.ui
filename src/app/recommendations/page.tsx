'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Favorite, Recommendation } from '@/lib/types';
import { AuthGuard } from '@/components/AuthGuard';
import { MovieCard } from '@/components/MovieCard';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';

interface FavoriteWithRecs {
    favorite: Favorite;
    recommendations: Recommendation[];
    loading: boolean;
}

function RecommendationsContent() {
    const [favoritesWithRecs, setFavoritesWithRecs] = useState<FavoriteWithRecs[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);

            try {
                // First, get user's favorites
                const favResponse = await api.getFavorites();

                if (favResponse.favorites.length === 0) {
                    setFavoritesWithRecs([]);
                    setLoading(false);
                    return;
                }

                // Initialize with loading state for each favorite
                const initialState = favResponse.favorites
                    .filter(f => f.movie)
                    .map(f => ({
                        favorite: f,
                        recommendations: [],
                        loading: true,
                    }));
                setFavoritesWithRecs(initialState);
                setLoading(false);

                // Fetch recommendations for each favorite in parallel
                const recsPromises = initialState.map(async (item, index) => {
                    try {
                        const recs = await api.getRecommendations(item.favorite.movie_id, 4);
                        setFavoritesWithRecs(prev => {
                            const updated = [...prev];
                            updated[index] = {
                                ...updated[index],
                                recommendations: recs.recommendations,
                                loading: false,
                            };
                            return updated;
                        });
                    } catch (err) {
                        console.error(`Failed to fetch recs for movie ${item.favorite.movie_id}:`, err);
                        setFavoritesWithRecs(prev => {
                            const updated = [...prev];
                            updated[index] = {
                                ...updated[index],
                                loading: false,
                            };
                            return updated;
                        });
                    }
                });

                await Promise.all(recsPromises);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load recommendations');
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return <LoadingState message="Generating your personalized recommendations..." />;
    }

    if (error) {
        return <ErrorState message={error} />;
    }

    if (favoritesWithRecs.length === 0) {
        return (
            <EmptyState
                title="No recommendations yet"
                message="Add some movies to your favorites first, and we'll show you personalized recommendations!"
                icon="🎯"
                action={{
                    label: "Browse Movies",
                    onClick: () => window.location.href = '/',
                }}
            />
        );
    }

    return (
        <div className="space-y-12">
            {favoritesWithRecs.map(({ favorite, recommendations, loading: recsLoading }) => (
                favorite.movie && (
                    <section key={favorite.id} className="glass rounded-2xl p-6">
                        {/* Source Movie Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-shrink-0 w-16 h-24 rounded-lg overflow-hidden bg-dark-800">
                                {favorite.movie.poster_url ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                        src={favorite.movie.poster_url}
                                        alt={favorite.movie.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl">
                                        🎬
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-dark-400 text-sm mb-1">Because you liked</p>
                                <Link
                                    href={`/movies/${favorite.movie.slug}`}
                                    className="text-xl font-bold text-white hover:text-primary-400 transition-colors"
                                >
                                    {favorite.movie.title}
                                </Link>
                                <p className="text-dark-400 text-sm">
                                    {favorite.movie.year} • {favorite.movie.genres.split(',').slice(0, 3).join(', ')}
                                </p>
                            </div>
                        </div>

                        {/* Recommendations Grid */}
                        {recsLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="aspect-[2/3] skeleton rounded-xl" />
                                ))}
                            </div>
                        ) : recommendations.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {recommendations.map((rec) => (
                                    <MovieCard
                                        key={rec.movie.id}
                                        movie={rec.movie}
                                        explanation={rec.explanation}
                                        showExplanation={true}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-dark-400 text-center py-8">
                                No recommendations found for this movie.
                            </p>
                        )}
                    </section>
                )
            ))}

            {/* Algorithm Explanation */}
            <div className="glass rounded-2xl p-6 text-center">
                <h3 className="text-lg font-bold text-white mb-2">
                    🧠 How Our Recommendations Work
                </h3>
                <p className="text-dark-300 max-w-2xl mx-auto">
                    Our recommendation engine uses <span className="text-primary-400 font-medium">cosine similarity</span> to
                    find movies that match your tastes. We analyze genres, decades, directors, and ratings to create a
                    feature vector for each movie, then find the ones most similar to your favorites.
                </p>
            </div>
        </div>
    );
}

export default function RecommendationsPage() {
    return (
        <AuthGuard>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white mb-3">
                        🎯 Personalized For You
                    </h1>
                    <p className="text-dark-300 text-lg max-w-2xl mx-auto">
                        Discover movies tailored to your taste, powered by our intelligent recommendation engine
                    </p>
                </div>

                <RecommendationsContent />
            </div>
        </AuthGuard>
    );
}
