interface EmptyStateProps {
    title?: string;
    message?: string;
    icon?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({
    title = "Nothing here yet",
    message = "No items to display",
    icon = "📭",
    action
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-dark-400 mb-4">{message}</p>
            {action && (
                <button onClick={action.onClick} className="btn-primary">
                    {action.label}
                </button>
            )}
        </div>
    );
}
