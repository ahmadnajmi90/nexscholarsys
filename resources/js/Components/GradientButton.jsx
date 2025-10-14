import React from 'react';
import { Loader2 } from 'lucide-react';

export default function GradientButton({
    children,
    type = 'submit',
    disabled = false,
    loading = false,
    onClick,
    className = '',
    fullWidth = true,
    ...props
}) {
    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            disabled={isDisabled}
            onClick={onClick}
            className={`
                relative overflow-hidden
                px-6 py-3 rounded-lg
                text-base font-medium text-white
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                ${fullWidth ? 'w-full' : ''}
                ${isDisabled
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                }
                ${className}
            `}
            {...props}
        >
            {/* Shimmer effect on hover */}
            {!isDisabled && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10 transition-opacity duration-500" />
            )}
            
            {/* Content */}
            <span className="relative flex items-center justify-center gap-2">
                {loading && (
                    <Loader2 className="w-5 h-5 animate-spin" />
                )}
                {children}
            </span>
        </button>
    );
}

