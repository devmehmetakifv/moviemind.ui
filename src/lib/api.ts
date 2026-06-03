import type {
    Movie,
    MovieList,
    RecommendationList,
    FavoriteList,
    Favorite,
    NotInterestedList,
    NotInterested,
    Feedback,
    FeedbackCreate,
    MovieFilters,
    SortOptions,
} from './types';
import { getAccessToken } from './supabase';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')
    .trim()
    .replace(/^["']|["']$/g, '') // strip stray quotes
    .replace(/\/+$/, ''); // strip trailing slash(es)

/**
 * API client for communicating with the backend
 */
class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async getHeaders(): Promise<HeadersInit> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const token = await getAccessToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const headers = await this.getHeaders();

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                ...headers,
                ...(options.headers || {}),
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Request failed' }));
            throw new Error(error.detail || 'Request failed');
        }

        return response.json();
    }

    // Movies
    async getMovies(
        page = 1,
        pageSize = 20,
        filters?: MovieFilters,
        sort?: SortOptions
    ): Promise<MovieList> {
        const params = new URLSearchParams({
            page: page.toString(),
            page_size: pageSize.toString(),
        });

        if (filters?.genres?.length) {
            params.set('genres', filters.genres.join(','));
        }
        if (filters?.decade) {
            params.set('decade', filters.decade);
        }
        if (filters?.min_rating !== undefined) {
            params.set('min_rating', filters.min_rating.toString());
        }
        if (filters?.max_rating !== undefined) {
            params.set('max_rating', filters.max_rating.toString());
        }
        if (filters?.director) {
            params.set('director', filters.director);
        }
        if (filters?.search) {
            params.set('search', filters.search);
        }
        if (sort) {
            params.set('sort_by', sort.field);
            params.set('sort_order', sort.order);
        }

        return this.request<MovieList>(`/api/movies?${params}`);
    }

    async getMovie(slug: string): Promise<Movie> {
        return this.request<Movie>(`/api/movies/${slug}`);
    }

    async searchMovies(query: string, page = 1): Promise<MovieList> {
        const params = new URLSearchParams({
            q: query,
            page: page.toString(),
        });
        return this.request<MovieList>(`/api/movies/search?${params}`);
    }

    async getRecommendations(movieId: number, limit = 6): Promise<RecommendationList> {
        return this.request<RecommendationList>(
            `/api/movies/${movieId}/recommendations?limit=${limit}`
        );
    }

    async getGenres(): Promise<string[]> {
        return this.request<string[]>('/api/movies/genres');
    }

    async getDecades(): Promise<string[]> {
        return this.request<string[]>('/api/movies/decades');
    }

    // Favorites
    async getFavorites(): Promise<FavoriteList> {
        return this.request<FavoriteList>('/api/favorites');
    }

    async addFavorite(movieId: number): Promise<Favorite> {
        return this.request<Favorite>('/api/favorites', {
            method: 'POST',
            body: JSON.stringify({ movie_id: movieId }),
        });
    }

    async removeFavorite(movieId: number): Promise<void> {
        await this.request(`/api/favorites/${movieId}`, { method: 'DELETE' });
    }

    async checkFavorite(movieId: number): Promise<boolean> {
        try {
            const result = await this.request<{ is_favorite: boolean }>(
                `/api/favorites/${movieId}/check`
            );
            return result.is_favorite;
        } catch {
            return false;
        }
    }

    // Not Interested
    async getNotInterested(): Promise<NotInterestedList> {
        return this.request<NotInterestedList>('/api/not-interested');
    }

    async addNotInterested(movieId: number): Promise<NotInterested> {
        return this.request<NotInterested>('/api/not-interested', {
            method: 'POST',
            body: JSON.stringify({ movie_id: movieId }),
        });
    }

    async removeNotInterested(movieId: number): Promise<void> {
        await this.request(`/api/not-interested/${movieId}`, { method: 'DELETE' });
    }

    // Feedback
    async submitFeedback(feedback: FeedbackCreate): Promise<Feedback> {
        return this.request<Feedback>('/api/feedback', {
            method: 'POST',
            body: JSON.stringify(feedback),
        });
    }
}

export const api = new ApiClient(API_URL);
