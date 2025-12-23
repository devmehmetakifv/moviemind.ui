'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Movie } from '@/lib/types';

interface MovieCardProps {
    movie: Movie;
    explanation?: string;
    showExplanation?: boolean;
}

export function MovieCard({ movie, explanation, showExplanation = false }: MovieCardProps) {
    const [imageError, setImageError] = useState(false);
    // Parse genres for badges
    const genres = movie.genres ? movie.genres.split(',').slice(0, 3) : [];

    const showPlaceholder = !movie.poster_url || imageError;

    return (
        <Link href={`/movies/${movie.slug}`}>
            <article className="movie-card glass rounded-2xl overflow-hidden h-full flex flex-col">
                {/* Poster Image */}
                <div className="relative aspect-[2/3] bg-dark-800">
                    {showPlaceholder ? (
                        <div className="w-full h-full flex items-center justify-center text-dark-500">
                            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                        </div>
                    ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={movie.poster_url}
                            alt={movie.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={() => setImageError(true)}
                        />
                    )}

                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 bg-dark-900/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-white font-semibold text-sm">{movie.rating.toFixed(1)}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                    {/* Title */}
                    <h3 className="font-bold text-white text-lg line-clamp-2 mb-1">
                        {movie.title}
                    </h3>

                    {/* Year & Director */}
                    <p className="text-dark-400 text-sm mb-3">
                        {movie.year} • {movie.director}
                    </p>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {genres.map((genre) => (
                            <span key={genre} className="badge text-xs">
                                {genre.trim()}
                            </span>
                        ))}
                    </div>

                    {/* Recommendation Explanation (Transparency KOG-05) */}
                    {showExplanation && explanation && (
                        <div className="mt-auto pt-3 border-t border-dark-700">
                            <p className="text-xs text-primary-400 flex items-start gap-1">
                                <span className="flex-shrink-0">💡</span>
                                <span className="line-clamp-2">{explanation}</span>
                            </p>
                        </div>
                    )}
                </div>
            </article>
        </Link>
    );
}

// Skeleton loader for MovieCard
export function MovieCardSkeleton() {
    return (
        <div className="glass rounded-2xl overflow-hidden">
            <div className="aspect-[2/3] skeleton" />
            <div className="p-4 space-y-3">
                <div className="h-6 skeleton w-3/4" />
                <div className="h-4 skeleton w-1/2" />
                <div className="flex gap-2">
                    <div className="h-6 skeleton w-16 rounded-full" />
                    <div className="h-6 skeleton w-16 rounded-full" />
                </div>
            </div>
        </div>
    );
}
