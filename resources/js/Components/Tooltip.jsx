import React, { useState } from 'react';

const Tooltip = ({ children, content, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    const positionClasses = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-1',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-1',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-1',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-1',
    };
    
    return (
        <div 
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            {children}
            
            {isVisible && (
                <div className={`absolute z-10 ${positionClasses[position]}`}>
                    <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        {content}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;