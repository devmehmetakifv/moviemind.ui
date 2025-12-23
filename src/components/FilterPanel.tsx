'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface FilterPanelProps {
    onFilterChange: (filters: {
        genres: string[];
        decade: string;
        minRating: number | null;
    }) => void;
    initialFilters?: {
        genres?: string[];
        decade?: string;
        minRating?: number;
    };
}

export function FilterPanel({ onFilterChange, initialFilters }: FilterPanelProps) {
    const [genres, setGenres] = useState<string[]>([]);
    const [decades, setDecades] = useState<string[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>(initialFilters?.genres || []);
    const [selectedDecade, setSelectedDecade] = useState(initialFilters?.decade || '');
    const [minRating, setMinRating] = useState<number | null>(initialFilters?.minRating || null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        // Fetch genres and decades
        Promise.all([api.getGenres(), api.getDecades()])
            .then(([genreList, decadeList]) => {
                setGenres(genreList);
                setDecades(decadeList);
            })
            .catch(console.error);
    }, []);

    const handleGenreToggle = (genre: string) => {
        const newGenres = selectedGenres.includes(genre)
            ? selectedGenres.filter(g => g !== genre)
            : [...selectedGenres, genre];
        setSelectedGenres(newGenres);
        onFilterChange({ genres: newGenres, decade: selectedDecade, minRating });
    };

    const handleDecadeChange = (decade: string) => {
        setSelectedDecade(decade);
        onFilterChange({ genres: selectedGenres, decade, minRating });
    };

    const handleRatingChange = (rating: number | null) => {
        setMinRating(rating);
        onFilterChange({ genres: selectedGenres, decade: selectedDecade, minRating: rating });
    };

    const handleClearFilters = () => {
        setSelectedGenres([]);
        setSelectedDecade('');
        setMinRating(null);
        onFilterChange({ genres: [], decade: '', minRating: null });
    };

    const hasActiveFilters = selectedGenres.length > 0 || selectedDecade || minRating !== null;

    return (
        <div className="glass rounded-xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center space-x-2 text-white font-semibold"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span>Filters</span>
                    {hasActiveFilters && (
                        <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {selectedGenres.length + (selectedDecade ? 1 : 0) + (minRating !== null ? 1 : 0)}
                        </span>
                    )}
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={handleClearFilters}
                        className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* Expandable Content */}
            {expanded && (
                <div className="space-y-6 animate-fade-in">
                    {/* Genre Filter */}
                    <div>
                        <h4 className="text-sm font-medium text-dark-300 mb-3">Genres</h4>
                        <div className="flex flex-wrap gap-2">
                            {genres.map(genre => (
                                <button
                                    key={genre}
                                    onClick={() => handleGenreToggle(genre)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedGenres.includes(genre)
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                                        }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Decade Filter */}
                    <div>
                        <h4 className="text-sm font-medium text-dark-300 mb-3">Decade</h4>
                        <select
                            value={selectedDecade}
                            onChange={(e) => handleDecadeChange(e.target.value)}
                            className="input-field"
                        >
                            <option value="">All decades</option>
                            {decades.map(decade => (
                                <option key={decade} value={decade}>{decade}</option>
                            ))}
                        </select>
                    </div>

                    {/* Rating Filter */}
                    <div>
                        <h4 className="text-sm font-medium text-dark-300 mb-3">
                            Minimum Rating: {minRating !== null ? minRating.toFixed(1) : 'Any'}
                        </h4>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.5"
                            value={minRating || 0}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                handleRatingChange(val > 0 ? val : null);
                            }}
                            className="w-full accent-primary-500"
                        />
                        <div className="flex justify-between text-xs text-dark-400 mt-1">
                            <span>0</span>
                            <span>10</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
