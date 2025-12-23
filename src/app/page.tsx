'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Movie, MovieFilters } from '@/lib/types';
import { MovieGrid } from '@/components/MovieGrid';
import { SearchBar } from '@/components/SearchBar';
import { FilterPanel } from '@/components/FilterPanel';
import { SortDropdown } from '@/components/SortDropdown';
import { ErrorState } from '@/components/ErrorState';

export default function HomePage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState<MovieFilters>({});
    const [sort, setSort] = useState({ field: 'rating', order: 'desc' });

    const fetchMovies = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.getMovies(page, 20, filters, {
                field: sort.field as 'title' | 'year' | 'rating',
                order: sort.order as 'asc' | 'desc',
            });
            setMovies(response.movies);
            setTotalPages(response.total_pages);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load movies');
        } finally {
            setLoading(false);
        }
    }, [page, filters, sort]);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const handleSearch = (query: string) => {
        setFilters(prev => ({ ...prev, search: query || undefined }));
        setPage(1);
    };

    const handleFilterChange = (newFilters: { genres: string[]; decade: string; minRating: number | null }) => {
        setFilters({
            ...filters,
            genres: newFilters.genres.length > 0 ? newFilters.genres : undefined,
            decade: newFilters.decade || undefined,
            min_rating: newFilters.minRating ?? undefined,
        });
        setPage(1);
    };

    const handleSortChange = (newSort: { field: string; order: string }) => {
        setSort(newSort);
        setPage(1);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <section className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                    Discover Your Next Favorite Movie
                </h1>
                <p className="text-dark-300 text-lg max-w-2xl mx-auto">
                    Explore our curated collection of films with AI-powered recommendations
                    that explain why you&apos;ll love them.
                </p>
            </section>

            {/* Search & Filters */}
            <section className="space-y-4 mb-8">
                <SearchBar onSearch={handleSearch} />

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <FilterPanel onFilterChange={handleFilterChange} />
                    <SortDropdown value={sort} onChange={handleSortChange} />
                </div>
            </section>

            {/* Error State */}
            {error && <ErrorState message={error} onRetry={fetchMovies} />}

            {/* Movie Grid */}
            {!error && (
                <>
                    <MovieGrid movies={movies} loading={loading} />

                    {/* Pagination */}
                    {!loading && movies.length > 0 && totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-4 mt-8">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-dark-300">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
