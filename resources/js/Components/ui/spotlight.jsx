import React from "react";

export function Spotlight({ children, className = "" }) {
    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-lg blur-xl"></div>
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
