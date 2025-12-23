interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({
    message = "Something went wrong",
    onRetry
}: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-white mb-2">Oops!</h3>
            <p className="text-dark-400 mb-4">{message}</p>
            {onRetry && (
                <button onClick={onRetry} className="btn-primary">
                    Try Again
                </button>
            )}
        </div>
    );
}
