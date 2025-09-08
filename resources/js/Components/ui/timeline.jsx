import React from "react";

export function Timeline({ children }) {
    return (
        <div className="relative">
            {React.Children.map(children, (child, index) => (
                <div key={index} className="relative">
                    {index > 0 && (
                        <div className="absolute left-3 top-0 w-0.5 h-6 bg-gray-300 -mt-6"></div>
                    )}
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <div className="flex-1 pb-8">
                            {child}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function TimelineItem({ children, className = "", isLast = false }) {
    return (
        <div className={`relative ${className}`}>
            {!isLast && (
                <div className="absolute left-3 top-6 w-0.5 h-full bg-gray-300"></div>
            )}
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="flex-1 pb-8">
                    {children}
                </div>
            </div>
        </div>
    );
}