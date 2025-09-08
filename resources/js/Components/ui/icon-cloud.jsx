import React from "react";

export function IconCloud({ iconSlugs }) {
    return (
        <div className="relative w-64 h-64 mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-4 gap-4">
                    {iconSlugs.slice(0, 16).map((slug, index) => (
                        <div
                            key={index}
                            className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-xs"
                            style={{
                                transform: `rotate(${index * 22.5}deg) translateY(-40px) rotate(-${index * 22.5}deg)`
                            }}
                        >
                            {slug.split('-').map(word => word[0]).join('').toUpperCase()}
                        </div>
                    ))}
                </div>
            </div>
            <div className="absolute inset-0 border-2 border-indigo-200 rounded-full animate-spin opacity-20"></div>
        </div>
    );
}
