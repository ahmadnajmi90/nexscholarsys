import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import ConversationCard from '@/Components/Messaging/ConversationCard';
import { usePage } from '@inertiajs/react';

export default function Index() {
    const { conversations } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');

    // Filter conversations based on search term
    const filteredConversations = (conversations || []).filter(conversation => {
        const title = conversation.title ||
            (conversation.participants || [])
                .filter(p => p.user?.id !== usePage().props.auth?.user?.id)
                .map(p => p.user?.name || 'Unknown')
                .join(', ');
        return title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <MainLayout title="Messages">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow">
                    {/* Search Header */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Conversations List */}
                    <div className="divide-y divide-gray-200">
                        {filteredConversations.length > 0 ? (
                            filteredConversations.map(conversation => (
                                <ConversationCard 
                                    key={conversation.id} 
                                    conversation={conversation} 
                                />
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                {searchTerm ? 'No conversations found.' : 'No conversations yet.'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}