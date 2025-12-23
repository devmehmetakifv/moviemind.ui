import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="text-center">
                <div className="text-8xl mb-6">🎬</div>
                <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                <h2 className="text-xl text-dark-300 mb-6">Page Not Found</h2>
                <p className="text-dark-400 mb-8 max-w-md mx-auto">
                    Looks like this scene didn&apos;t make the final cut.
                    Let&apos;s get you back to browsing movies.
                </p>
                <Link href="/" className="btn-primary">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
