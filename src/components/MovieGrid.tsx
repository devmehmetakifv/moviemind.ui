import type { Movie, Recommendation } from '@/lib/types';
import { MovieCard, MovieCardSkeleton } from './MovieCard';

interface MovieGridProps {
    movies?: Movie[];
    recommendations?: Recommendation[];
    loading?: boolean;
    showExplanations?: boolean;
    emptyMessage?: string;
}

export function MovieGrid({
    movies,
    recommendations,
    loading = false,
    showExplanations = false,
    emptyMessage = "No movies found",
}: MovieGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                    <MovieCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    // If we have recommendations, use those
    if (recommendations && recommendations.length > 0) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {recommendations.map((rec) => (
                    <MovieCard
                        key={rec.movie.id}
                        movie={rec.movie}
                        explanation={rec.explanation}
                        showExplanation={showExplanations}
                    />
                ))}
            </div>
        );
    }

    // If we have plain movies, use those
    if (movies && movies.length > 0) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        );
    }

    // Empty state
    return (
        <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-dark-400 text-lg">{emptyMessage}</p>
        </div>
    );
}
