'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

interface FeedbackFormProps {
    movieId: number;
    onClose: () => void;
}

export function FeedbackForm({ movieId, onClose }: FeedbackFormProps) {
    const [fieldName, setFieldName] = useState('');
    const [issue, setIssue] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await api.submitFeedback({
                movie_id: movieId,
                field_name: fieldName,
                reported_issue: issue,
            });
            setSubmitted(true);
            setTimeout(() => onClose(), 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit feedback');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="glass rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-white font-semibold">Thank you for your feedback!</p>
                <p className="text-dark-400 text-sm">We&apos;ll review the reported issue.</p>
            </div>
        );
    }

    return (
        <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Report Data Error</h3>
                <button onClick={onClose} className="text-dark-400 hover:text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm text-dark-300 mb-2">Which field has an error?</label>
                    <select
                        value={fieldName}
                        onChange={(e) => setFieldName(e.target.value)}
                        className="input-field"
                        required
                    >
                        <option value="">Select a field...</option>
                        <option value="title">Title</option>
                        <option value="year">Year</option>
                        <option value="director">Director</option>
                        <option value="genres">Genres</option>
                        <option value="rating">Rating</option>
                        <option value="description">Description</option>
                        <option value="poster_url">Poster Image</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-dark-300 mb-2">Describe the issue</label>
                    <textarea
                        value={issue}
                        onChange={(e) => setIssue(e.target.value)}
                        className="input-field min-h-[100px]"
                        placeholder="e.g., The director name is incorrect, it should be..."
                        required
                    />
                </div>

                {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                )}

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-secondary text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary text-sm disabled:opacity-50"
                    >
                        {submitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                </div>
            </form>
        </div>
    );
}
