import React from 'react';
import { Users, Search, MessageSquare, Target, Star, CheckCircle } from 'lucide-react';

const FindingSupervisorGuide = () => {
    return (
        <div className="space-y-8">
            <div className="border-b border-gray-200 pb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                    From Search to Connection: A 5-Minute Guide to Finding Your Perfect Supervisor
                </h1>
                <p className="text-base sm:text-lg text-gray-600">
                    Master the art of finding and connecting with the right research supervisor for your academic journey
                </p>
            </div>

            <div className="grid gap-4 sm:gap-6 lg:gap-8">
                {/* Video Section */}
                <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 leading-tight">See Semantic Search in Action</h2>
                        <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
                            A short, engaging video showing the semantic supervisor search in action, from typing a query to understanding the results.
                            Watch how our AI-powered system finds supervisors based on conceptual understanding, not just keywords.
                        </p>
                    </div>

                    {/* Video Placeholder */}
                    <div className="bg-gray-900 rounded-lg p-4 sm:p-6 lg:p-8 text-center max-w-4xl mx-auto">
                        <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                            <div className="text-white text-center">
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Semantic Supervisor Search Demo</h3>
                                <p className="text-gray-300 text-sm">Watch how AI finds your perfect supervisor match</p>
                            </div>
                        </div>
                        <div className="text-gray-400 text-sm">
                            [Video: 2-minute demonstration of semantic search functionality]
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default FindingSupervisorGuide;
