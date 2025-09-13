import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import ConversationCard from '@/Components/Messaging/ConversationCard';
import { usePage, Link } from '@inertiajs/react';
import { MessageSquare, Search } from 'lucide-react';

export default function Index() {
    const { conversations, auth } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedConversation, setSelectedConversation] = useState(null);

    // Filter conversations based on search term
    const filteredConversations = (conversations || []).filter(conversation => {
        const title = conversation.title ||
            (conversation.participants || [])
                .filter(p => p.user?.id !== auth?.user?.id)
                .map(p => p.user?.name || 'Unknown')
                .join(', ');
        return title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <MainLayout title="Messages">
            <div className="flex h-[calc(100vh-64px)]">
                {/* Left Sidebar - Conversations List */}
                <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col h-full">
                    {/* Messages Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h1 className="text-xl font-semibold">Messages</h1>
                        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Search Box */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.length > 0 ? (
                            filteredConversations.map(conversation => (
                                <ConversationCard 
                                    key={conversation.id} 
                                    conversation={conversation}
                                    isSelected={selectedConversation === conversation.id}
                                    onClick={() => setSelectedConversation(conversation.id)}
                                />
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                {searchTerm ? 'No conversations found.' : 'No conversations yet.'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Content - Empty State or Conversation */}
                <div className="flex-1 bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="h-12 w-12 text-indigo-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Select a conversation</h2>
                        <p className="text-gray-500 mb-6">Choose from your existing conversations or start a new one</p>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                            New Conversation
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}