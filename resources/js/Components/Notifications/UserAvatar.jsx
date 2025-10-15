import React, { useState } from 'react';
import { getAvatarColor, getInitials } from '@/Utils/notificationHelpers';

/**
 * UserAvatar Component
 * 
 * Displays a user avatar with profile picture or initial badge fallback
 * 
 * @param {string} src - Profile picture URL
 * @param {string} name - User's full name
 * @param {string} size - Size variant: 'sm', 'md', 'lg' (default: 'md')
 */
export default function UserAvatar({ src, name, size = 'md' }) {
    const [imageError, setImageError] = useState(false);

    // Size configurations
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
    };

    const resolveSrc = (raw) => {
        if (!raw) return null;
        if (typeof raw !== 'string') return null;
        if (/^https?:\/\//i.test(raw)) return raw; // absolute URL
        if (raw.startsWith('/storage/')) return raw; // already public path
        // normalize leading slash, then prefix storage (public disk)
        const normalized = raw.replace(/^\//, '');
        return `/storage/${normalized}`;
    };

    const computedSrc = resolveSrc(src);
    const shouldShowImage = computedSrc && !imageError;
    // no debug logs in production UI
    const initials = getInitials(name);
    const colors = getAvatarColor(name);

    return (
        <div
            className={`
                ${sizeClasses[size]}
                rounded-full
                flex items-center justify-center
                flex-shrink-0
                overflow-hidden
                ${shouldShowImage ? 'bg-gray-100' : `${colors.bg} border ${colors.border}`}
            `}
        >
            {shouldShowImage ? (
                <img
                    src={computedSrc}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                <span className={`font-semibold ${colors.text}`}>
                    {initials}
                </span>
            )}
        </div>
    );
}

