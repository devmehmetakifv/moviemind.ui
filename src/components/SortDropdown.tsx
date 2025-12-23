'use client';

interface SortDropdownProps {
    value: { field: string; order: string };
    onChange: (sort: { field: string; order: string }) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
    const options = [
        { label: 'Title (A-Z)', field: 'title', order: 'asc' },
        { label: 'Title (Z-A)', field: 'title', order: 'desc' },
        { label: 'Year (Newest)', field: 'year', order: 'desc' },
        { label: 'Year (Oldest)', field: 'year', order: 'asc' },
        { label: 'Rating (Highest)', field: 'rating', order: 'desc' },
        { label: 'Rating (Lowest)', field: 'rating', order: 'asc' },
    ];

    const currentValue = `${value.field}-${value.order}`;

    return (
        <div className="flex items-center space-x-2">
            <label className="text-sm text-dark-400">Sort by:</label>
            <select
                value={currentValue}
                onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    onChange({ field, order });
                }}
                className="input-field py-2 w-auto min-w-[160px]"
            >
                {options.map(option => (
                    <option key={`${option.field}-${option.order}`} value={`${option.field}-${option.order}`}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
