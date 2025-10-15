/**
 * Notification Helper Utilities
 * 
 * Provides utility functions for notification formatting and display
 */

/**
 * Convert a date to a relative time string (e.g., "2m ago", "3h ago")
 * @param {string|Date} date - The date to convert
 * @returns {string} Relative time string
 */
export function getRelativeTime(date) {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now - then) / 1000);

    // Just now (less than 60 seconds)
    if (diffInSeconds < 60) {
        return 'just now';
    }

    // Minutes ago
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    }

    // Hours ago
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    }

    // Days ago
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}d ago`;
    }

    // Weeks ago
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `${diffInWeeks}w ago`;
    }

    // For older dates, return formatted date
    return then.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: then.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

/**
 * Get a consistent color for a user's avatar based on their name
 * @param {string} name - The user's name
 * @returns {object} Object with bg (background) and text colors
 */
export function getAvatarColor(name) {
    const colors = [
        { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
        { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
        { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
        { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
        { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
        { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
    ];

    // Use first letter to determine color (consistent per user)
    const firstLetter = name?.charAt(0).toUpperCase() || 'A';
    const index = firstLetter.charCodeAt(0) % colors.length;

    return colors[index];
}

/**
 * Extract initials from a full name
 * @param {string} name - The user's full name
 * @returns {string} Two-letter initials (e.g., "John Doe" -> "JD")
 */
export function getInitials(name) {
    if (!name) return '??';

    const words = name.trim().split(/\s+/);
    
    if (words.length === 1) {
        // Single word: take first two characters
        return words[0].substring(0, 2).toUpperCase();
    }

    // Multiple words: take first letter of first and last word
    const firstInitial = words[0].charAt(0);
    const lastInitial = words[words.length - 1].charAt(0);

    return (firstInitial + lastInitial).toUpperCase();
}

