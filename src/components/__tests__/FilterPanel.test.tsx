import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the API
jest.mock('@/lib/api', () => ({
    api: {
        getGenres: jest.fn().mockResolvedValue(['Action', 'Comedy', 'Drama']),
        getDecades: jest.fn().mockResolvedValue(['1990s', '2000s', '2010s']),
    },
}));

describe('FilterPanel', () => {
    const mockOnFilterChange = jest.fn();

    beforeEach(() => {
        mockOnFilterChange.mockClear();
    });

    it('renders filter toggle button', async () => {
        const { FilterPanel } = await import('@/components/FilterPanel');
        render(<FilterPanel onFilterChange={mockOnFilterChange} />);
        expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('expands when clicked', async () => {
        const { FilterPanel } = await import('@/components/FilterPanel');
        render(<FilterPanel onFilterChange={mockOnFilterChange} />);

        const filterButton = screen.getByText('Filters');
        fireEvent.click(filterButton);

        // Should show Genres section after expansion
        expect(screen.getByText('Genres')).toBeInTheDocument();
    });

    it('shows clear all button when filters are active', async () => {
        const { FilterPanel } = await import('@/components/FilterPanel');
        render(
            <FilterPanel
                onFilterChange={mockOnFilterChange}
                initialFilters={{ genres: ['Action'] }}
            />
        );

        expect(screen.getByText('Clear all')).toBeInTheDocument();
    });
});
