import React from 'react';

const BetaBadge = ({ variant = 'sidebar' }) => {
    const baseClasses = "bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-sm uppercase";
    
    const variantClasses = {
        sidebar: "absolute top-0.5 right-0.5 z-10 px-1.5 py-0.5 text-[9px]",
        inline: "inline-flex items-center px-2 text-[10px]"
    };
    
    return (
        <span 
            className={`${baseClasses} ${variantClasses[variant]}`}
            aria-label="Beta feature"
        >
            BETA
        </span>
    );
};

export default BetaBadge;

