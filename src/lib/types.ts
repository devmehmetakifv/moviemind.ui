/**
 * TypeScript type definitions for Moviemind UI
 */

// Movie Types
export interface Movie {
    id: number;
    slug: string;
    title: string;
    year: number;
    decade: string;
    release_date: string;
    director: string;
    genres: string;
    rating: number;
    imdb_url: string;
    poster_url: string;
    description: string;
}

export interface MovieList {
    movies: Movie[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

export interface Recommendation {
    movie: Movie;
    similarity_score: number;
    explanation: string;
}

export interface RecommendationList {
    recommendations: Recommendation[];
    source_movie_id: number;
}

// User Preference Types
export interface Favorite {
    id: string;
    user_id: string;
    movie_id: number;
    created_at: string;
    movie?: Movie;
}

export interface FavoriteList {
    favorites: Favorite[];
    total: number;
}

export interface NotInterested {
    id: string;
    user_id: string;
    movie_id: number;
    created_at: string;
}

export interface NotInterestedList {
    items: NotInterested[];
    total: number;
}

// Feedback Types
export interface FeedbackCreate {
    movie_id: number;
    field_name: string;
    reported_issue: string;
}

export interface Feedback {
    id: string;
    user_id?: string;
    movie_id: number;
    field_name: string;
    reported_issue: string;
    created_at: string;
}

// Auth Types
export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user_id: string;
    email: string;
}

export interface UserInfo {
    id: string;
    email: string;
}

// Filter Types
export interface MovieFilters {
    genres?: string[];
    decade?: string;
    min_rating?: number;
    max_rating?: number;
    director?: string;
    search?: string;
}

export interface SortOptions {
    field: 'title' | 'year' | 'rating';
    order: 'asc' | 'desc';
}

// API Response Types
export interface MessageResponse {
    message: string;
    success: boolean;
}

export interface ErrorResponse {
    detail: string;
    error_code?: string;
}

// UI State Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
