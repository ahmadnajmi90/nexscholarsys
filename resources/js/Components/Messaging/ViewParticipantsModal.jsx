import React from 'react';
import { Link } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import Avatar from '@/Components/Shared/Avatar';

export default function ViewParticipantsModal({ show, onClose, participants = [] }) {
    // Helper function to generate profile URL for a user
    const getProfileUrl = (user) => {
        const role = user?.role?.toLowerCase();
        let profileUrl = null;

        if (role === 'academician' && user?.academician?.url) {
            profileUrl = route('academicians.show', user.academician.url);
        } else if (role === 'postgraduate' && user?.postgraduate?.url) {
            profileUrl = route('postgraduates.show', user.postgraduate.url);
        } else if (role === 'undergraduate' && user?.undergraduate?.url) {
            profileUrl = route('undergraduates.show', user.undergraduate.url);
        }

        return profileUrl;
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="bg-white">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Group Participants ({participants.length})
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Participants List */}
                <div className="max-h-96 overflow-y-auto px-6 py-4">
                    <div className="space-y-3">
                        {participants.map((participant) => {
                            const user = participant.user;
                            const profileUrl = getProfileUrl(user);
                            const roleDisplay = participant.role === 'owner' ? 'Owner' :
                                               participant.role === 'admin' ? 'Admin' : 'Member';

                            return (
                                <div key={participant.id} className="flex items-center gap-3">
                                    <Avatar
                                        src={user?.avatar_url ?? user?.profile_photo_url}
                                        alt={user?.full_name ?? user?.name}
                                        size={40}
                                    />
                                    <div className="flex-1 min-w-0">
                                        {profileUrl ? (
                                            <Link
                                                href={profileUrl}
                                                className="block font-medium text-gray-900 hover:text-blue-600 truncate"
                                            >
                                                {user?.full_name ?? user?.name ?? 'Unknown User'}
                                            </Link>
                                        ) : (
                                            <span className="block font-medium text-gray-900 truncate">
                                                {user?.full_name ?? user?.name ?? 'Unknown User'}
                                            </span>
                                        )}
                                        <span className="text-sm text-gray-500 capitalize">
                                            {roleDisplay}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t px-6 py-4">
                    <button
                        onClick={onClose}
                        className="w-full rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}
