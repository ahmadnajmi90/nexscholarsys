import { useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function TopBar() {
    const [query, setQuery] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setShowResults(true);
        setAnswer('');
        setError(null);

        try {
            // Call Supabase Edge Function
            const { data, error: functionError } = await supabase.functions.invoke('ai-search', {
                body: { query }
            });

            if (functionError) throw functionError;

            if (data?.error) {
                setError(data.error);
                setAnswer('Sorry, there was an error processing your request.');
            } else {
                setAnswer(data.answer || 'No answer received.');
            }
        } catch (err) {
            console.error('AI Search error:', err);
            setError(err.message || 'Failed to get AI response');
            setAnswer('Sorry, AI search is currently unavailable. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const closeResults = () => {
        setShowResults(false);
        setAnswer('');
        setError(null);
    };

    return (
        <div className="relative">
            {/* Search Bar - Bright and Focused */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <form onSubmit={handleSearch} className="max-w-3xl">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder='Try asking "who has the most network links?" or "top universities in Johor"'
                            className="w-full pl-12 pr-12 py-3 bg-white dark:bg-gray-900 border-2 border-blue-200 dark:border-blue-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
                            disabled={isLoading}
                        />
                        {isLoading && (
                            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
                        )}
                    </div>
                </form>
                
                {/* Example queries hint */}
                <div className="mt-2.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
                    💡 AI-powered search • Ask questions about researchers, universities, or collaborations
                </div>
            </div>

            {/* Backdrop - Click to close */}
            {showResults && (
                <div 
                    className="fixed inset-0 bg-black/20 z-[10000]"
                    onClick={closeResults}
                />
            )}

            {/* Results Panel */}
            {showResults && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-2xl z-[10001] max-h-96 overflow-y-auto">
                    <div className="p-6 max-w-4xl mx-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                    AI Search Results
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Question: <span className="font-medium">{query}</span>
                                </p>
                            </div>
                            <button 
                                onClick={closeResults}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>
                        
                        {isLoading ? (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Analyzing research network...</span>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    <strong>Error:</strong> {error}
                                </p>
                                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                                    Note: AI search requires Supabase Edge Function 'ai-search' to be deployed.
                                </p>
                            </div>
                        ) : (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                        {answer}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

