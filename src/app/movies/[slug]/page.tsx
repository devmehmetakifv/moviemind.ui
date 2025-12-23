'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Movie, Recommendation } from '@/lib/types';
import { MovieGrid } from '@/components/MovieGrid';
import { ErrorState } from '@/components/ErrorState';
import { FeedbackForm } from '@/components/FeedbackForm';

// Skeleton loader for movie detail page
function MovieDetailSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button Skeleton */}
            <div className="h-6 w-32 skeleton rounded mb-6" />

            {/* Movie Details Skeleton */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
                {/* Poster Skeleton */}
                <div className="md:col-span-1">
                    <div className="aspect-[2/3] skeleton rounded-2xl" />
                </div>

                {/* Info Skeleton */}
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <div className="h-10 skeleton w-3/4 rounded mb-2" />
                        <div className="h-5 skeleton w-1/2 rounded" />
                    </div>

                    {/* Genres Skeleton */}
                    <div className="flex flex-wrap gap-2">
                        <div className="h-8 skeleton w-20 rounded-full" />
                        <div className="h-8 skeleton w-24 rounded-full" />
                        <div className="h-8 skeleton w-16 rounded-full" />
                    </div>

                    {/* Description Skeleton */}
                    <div className="space-y-2">
                        <div className="h-4 skeleton w-full rounded" />
                        <div className="h-4 skeleton w-full rounded" />
                        <div className="h-4 skeleton w-3/4 rounded" />
                    </div>

                    {/* Buttons Skeleton */}
                    <div className="flex flex-wrap gap-4">
                        <div className="h-12 skeleton w-40 rounded-xl" />
                        <div className="h-12 skeleton w-36 rounded-xl" />
                        <div className="h-12 skeleton w-32 rounded-xl" />
                    </div>
                </div>
            </div>

            {/* Recommendations Skeleton */}
            <div className="h-8 skeleton w-64 rounded mb-6" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[2/3] skeleton rounded-2xl" />
                ))}
            </div>
        </div>
    );
}

export default function MovieDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const { user } = useAuth();

    const [movie, setMovie] = useState<Movie | null>(null);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [posterError, setPosterError] = useState(false);
    const [isNotInteresting, setIsNotInteresting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);
            setPosterError(false);

            try {
                // First fetch movie by slug
                const movieData = await api.getMovie(slug);
                setMovie(movieData);

                // Then fetch recommendations using movie.id
                const recsData = await api.getRecommendations(movieData.id);
                setRecommendations(recsData.recommendations);

                // Check if favorited
                if (user) {
                    const fav = await api.checkFavorite(movieData.id);
                    setIsFavorite(fav);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load movie');
            } finally {
                setLoading(false);
            }
        }

        if (slug) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, user?.id]);

    // Auto-hide feedback message after 3 seconds
    useEffect(() => {
        if (feedbackMessage) {
            const timer = setTimeout(() => {
                setFeedbackMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [feedbackMessage]);

    const handleToggleFavorite = async () => {
        if (!user || !movie) return;

        try {
            if (isFavorite) {
                await api.removeFavorite(movie.id);
                setIsFavorite(false);
            } else {
                await api.addFavorite(movie.id);
                setIsFavorite(true);
            }
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
        }
    };

    const handleNotInterested = async () => {
        if (!user || !movie || isNotInteresting) return;

        setIsNotInteresting(true);
        setFeedbackMessage("Updating your preferences...");

        try {
            await api.addNotInterested(movie.id);
            setFeedbackMessage("Got it! We won't show you this movie anymore.");

            // Navigate back after a short delay
            setTimeout(() => {
                router.push('/');
            }, 1500);
        } catch (err) {
            console.error('Failed to mark as not interested:', err);
            setFeedbackMessage("Something went wrong. Please try again.");
            setIsNotInteresting(false);
        }
    };

    if (loading) {
        return <MovieDetailSkeleton />;
    }

    if (error || !movie) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <ErrorState message={error || 'Movie not found'} />
            </div>
        );
    }

    const genres = movie.genres ? movie.genres.split(',').map(g => g.trim()) : [];
    const showPosterPlaceholder = !movie.poster_url || posterError;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Feedback Toast */}
            {feedbackMessage && (
                <div className="fixed top-4 right-4 z-50 animate-fade-in">
                    <div className="glass bg-dark-800/90 px-6 py-4 rounded-xl shadow-lg border border-dark-600 flex items-center space-x-3">
                        {isNotInteresting && !feedbackMessage.includes("won't") && (
                            <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                        )}
                        {feedbackMessage.includes("won't") && (
                            <span className="text-green-400">✓</span>
                        )}
                        {feedbackMessage.includes("wrong") && (
                            <span className="text-red-400">✕</span>
                        )}
                        <p className="text-white">{feedbackMessage}</p>
                    </div>
                </div>
            )}

            {/* Back Button */}
            <Link href="/" className="inline-flex items-center text-dark-300 hover:text-white mb-6 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Browse
            </Link>

            {/* Movie Details */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
                {/* Poster */}
                <div className="md:col-span-1">
                    <div className="relative aspect-[2/3] rounded-2xl overflow-hidden glass">
                        {showPosterPlaceholder ? (
                            <div className="w-full h-full flex items-center justify-center text-dark-500">
                                <span className="text-6xl">🎬</span>
                            </div>
                        ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={movie.poster_url}
                                alt={movie.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={() => setPosterError(true)}
                            />
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            {movie.title}
                        </h1>
                        <div className="flex items-center space-x-4 text-dark-300">
                            <span>{movie.year}</span>
                            <span>•</span>
                            <span>{movie.director}</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                                <span className="text-yellow-400">★</span>
                                <span className="font-semibold text-white">{movie.rating.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-2">
                        {genres.map(genre => (
                            <span key={genre} className="badge">
                                {genre}
                            </span>
                        ))}
                    </div>

                    {/* Description */}
                    <p className="text-dark-200 leading-relaxed">
                        {movie.description}
                    </p>

                    {/* Action Buttons - Mobile Responsive */}
                    <div className="flex flex-wrap gap-3">
                        {user && (
                            <>
                                {/* Favorites and Not Interested grouped together for mobile */}
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={handleToggleFavorite}
                                        className={`btn-primary flex-1 sm:flex-none flex items-center justify-center space-x-2 ${isFavorite ? 'bg-pink-600 hover:bg-pink-500' : ''}`}
                                    >
                                        <span>{isFavorite ? '❤️' : '🤍'}</span>
                                        <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
                                    </button>
                                    <button
                                        onClick={handleNotInterested}
                                        disabled={isNotInteresting}
                                        className={`btn-secondary flex-1 sm:flex-none flex items-center justify-center space-x-2 ${isNotInteresting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isNotInteresting ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <span>🚫</span>
                                        )}
                                        <span>Not Interested</span>
                                    </button>
                                </div>
                            </>
                        )}
                        <a
                            href={movie.imdb_url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`btn-secondary flex items-center space-x-2 ${!movie.imdb_url ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <span>🔗</span>
                            <span>View on IMDb</span>
                        </a>
                        <button
                            onClick={() => setShowFeedback(!showFeedback)}
                            className="btn-secondary flex items-center space-x-2"
                        >
                            <span>📝</span>
                            <span>Report Error</span>
                        </button>
                    </div>

                    {/* Feedback Form */}
                    {showFeedback && movie && (
                        <div className="animate-fade-in">
                            <FeedbackForm
                                movieId={movie.id}
                                onClose={() => setShowFeedback(false)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">
                        🎯 Similar Movies You Might Like
                    </h2>
                    <MovieGrid
                        recommendations={recommendations}
                        showExplanations={true}
                    />
                </section>
            )}
        </div>
    );
}

