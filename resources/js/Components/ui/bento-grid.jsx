import React from "react";

export function BentoGrid({ children, className = "" }) {
    return (
        <div className={`grid gap-4 ${className}`}>
            {children}
        </div>
    );
}

export function BentoCard({ children, name, className = "", background }) {
    return (
        <div className={`relative rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow ${className}`}>
            {background && (
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                    {background}
                </div>
            )}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
