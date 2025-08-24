import React from 'react';
import { Link } from '@inertiajs/react';

const NewsEventsSection = ({ posts = [] }) => {
    console.log(posts)
    // The first post will be used for the featured article on the left (as is currently hardcoded).
    // We will use the next 6 posts for the list on the right.
    const smallerArticles = posts.slice(0, 6).map(post => ({
        title: post.title,
        // Access the full name directly from the eager-loaded relationship
        author: post.author ? post.author.full_name : 'NexScholar Team',
        date: new Date(post.created_at).toLocaleDateString(),
        url: post.url
    }));

    return (
        <section id="news" className="py-40 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                    <div>
                        <h2 className="text-5xl font-extrabold text-gray-900 mb-4 font-[sans-serif]">
                            News & Events
                        </h2>
                        <p className="text-gray-600 text-xl">
                            Latest research highlights, platform updates, and academic opportunities
                        </p>
                    </div>
                    <a
                            href={route('posts.index')}
                            className="inline-flex items-center px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-gradient-to-r from-purple-600 to-pink-600 hover:text-white transition-all duration-300 font-semibold"
                        >
                            READ ALL NEWS
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                            </svg>
                    </a>
                </div>

                {/* Main Two-Column Layout */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="grid lg:grid-cols-3 gap-8 relative">
                        {/* Vertical Separator Line */}
                        <div className="hidden lg:block absolute left-2/3 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-pink-300 to-transparent"></div>
                        
                        {/* Left Column - Featured Article (2/3 width) */}
                        <div className="lg:col-span-2 flex flex-col"> {/* <-- 1. Make this a flex column */}
                            {/* 2. Make image container grow and remove fixed height */}
                            <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-blue-600 rounded-xl overflow-hidden shadow-lg mb-6 flex-grow mr-4 cursor-pointer">
                                {/* 3. Make the image cover the container */}
                                <img 
                                    src="/images/AI.jpg" 
                                    className="w-full h-full object-cover" 
                                />
                            </div>

                            <h3 className="text-4xl font-extrabold text-gray-900 leading-tight flex-shrink-0 font-[sans-serif] hover:text-purple-600 transition-colors cursor-pointer mb-6">
                                NexScholar Launches AI Validation Tool for Academic Surveys
                            </h3>
                        </div>

                        {/* Right Column - Article List (1/3 width) */}
                        <div className="lg:col-span-1">
                            <div className="space-y-6">
                                {smallerArticles.map((article, index) => (
                                    <div key={index} className={`pb-6 ${index < smallerArticles.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                        <Link 
                                            href={route('welcome.posts.show', article.url)}
                                            className="block"
                                        >
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2 hover:text-purple-600 transition-colors cursor-pointer leading-tight font-[sans-serif]">
                                                {article.title}
                                            </h4>
                                            <p className="text-gray-500 text-sm">
                                                <span className="font-semibold text-purple-600 uppercase">{article.author}</span> - {article.date}
                                            </p>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsEventsSection; 