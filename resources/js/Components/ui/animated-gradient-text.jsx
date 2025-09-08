import React from "react";

export function AnimatedGradientText({ children, className = "" }) {
    return (
        <span className={`bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse ${className}`}>
            {children}
        </span>
    );
}
