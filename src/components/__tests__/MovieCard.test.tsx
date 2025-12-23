import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock Next.js components
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}));

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('MovieCard', () => {
    const mockMovie = {
        id: 1,
        title: 'Test Movie',
        year: 2000,
        decade: '2000s',
        release_date: '01-Jan-2000',
        director: 'Test Director',
        genres: 'Action,Comedy,Drama',
        rating: 8.5,
        imdb_url: 'http://imdb.com/test',
        poster_url: 'http://example.com/poster.jpg',
        description: 'A test movie description',
    };

    it('renders movie title', async () => {
        const { MovieCard } = await import('@/components/MovieCard');
        render(<MovieCard movie={mockMovie} />);
        expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });

    it('renders movie year and director', async () => {
        const { MovieCard } = await import('@/components/MovieCard');
        render(<MovieCard movie={mockMovie} />);
        expect(screen.getByText('2000 • Test Director')).toBeInTheDocument();
    });

    it('renders rating badge', async () => {
        const { MovieCard } = await import('@/components/MovieCard');
        render(<MovieCard movie={mockMovie} />);
        expect(screen.getByText('8.5')).toBeInTheDocument();
    });

    it('renders genre badges (first 3)', async () => {
        const { MovieCard } = await import('@/components/MovieCard');
        render(<MovieCard movie={mockMovie} />);
        expect(screen.getByText('Action')).toBeInTheDocument();
        expect(screen.getByText('Comedy')).toBeInTheDocument();
        expect(screen.getByText('Drama')).toBeInTheDocument();
    });

    it('shows recommendation explanation when provided', async () => {
        const { MovieCard } = await import('@/components/MovieCard');
        render(
            <MovieCard
                movie={mockMovie}
                explanation="Same genres: Comedy"
                showExplanation={true}
            />
        );
        expect(screen.getByText('Same genres: Comedy')).toBeInTheDocument();
    });

    it('handles null genres gracefully', async () => {
        const { MovieCard } = await import('@/components/MovieCard');
        const movieWithNoGenres = { ...mockMovie, genres: '' };
        render(<MovieCard movie={movieWithNoGenres} />);
        expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });
});

describe('MovieCardSkeleton', () => {
    it('renders loading skeleton', async () => {
        const { MovieCardSkeleton } = await import('@/components/MovieCard');
        const { container } = render(<MovieCardSkeleton />);
        expect(container.querySelector('.skeleton')).toBeInTheDocument();
    });
});
