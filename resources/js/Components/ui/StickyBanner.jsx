import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * StickyBanner Component
 * 
 * A reusable sticky banner component with Aceternity UI styling.
 * 
 * @param {string} message - The message to display in the banner
 * @param {string} type - Banner type: 'info', 'warning', 'success', 'error' (default: 'info')
 * @param {boolean} dismissible - Whether the banner can be dismissed (default: true)
 * @param {string} persistKey - LocalStorage key to persist dismissal state
 * @param {string} className - Additional CSS classes
 * @param {boolean} hideOnScroll - Whether to hide banner when scrolling down (default: false)
 * 
 * Usage Examples:
 * 
 * // Basic info banner
 * <StickyBanner message="Welcome to our new platform!" />
 * 
 * // Warning banner with persistence
 * <StickyBanner 
 *   message="Please update your profile information" 
 *   type="warning"
 *   persistKey="profile-update-warning"
 * />
 * 
 * // Success banner that hides on scroll
 * <StickyBanner 
 *   message="Settings saved successfully!" 
 *   type="success"
 *   hideOnScroll={true}
 * />
 */

const StickyBanner = ({ 
    message, 
    type = 'info', 
    dismissible = true, 
    persistKey = 'sticky-banner-dismissed',
    className = '',
    hideOnScroll = false 
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isScrollHidden, setIsScrollHidden] = useState(false);

    // Check if banner was previously dismissed
    useEffect(() => {
        if (dismissible && persistKey) {
            const isDismissed = localStorage.getItem(persistKey) === 'true';
            setIsVisible(!isDismissed);
        }
    }, [dismissible, persistKey]);

    // Handle scroll-based hiding
    useEffect(() => {
        if (!hideOnScroll) return;

        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 40 && currentScrollY > lastScrollY) {
                setIsScrollHidden(true);
            } else if (currentScrollY < lastScrollY) {
                setIsScrollHidden(false);
            }
            
            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hideOnScroll]);

    const handleDismiss = () => {
        setIsVisible(false);
        if (persistKey) {
            localStorage.setItem(persistKey, 'true');
        }
    };

    // Type-based styling
    const getTypeStyles = () => {
        switch (type) {
            case 'warning':
                return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 border-yellow-300';
            case 'success':
                return 'bg-gradient-to-r from-green-400 to-green-500 text-green-900 border-green-300';
            case 'error':
                return 'bg-gradient-to-r from-red-400 to-red-500 text-red-900 border-red-300';
            case 'info':
            default:
                return 'bg-gradient-to-r from-blue-400 to-blue-500 text-blue-900 border-blue-300';
        }
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ 
                    y: isScrollHidden ? -100 : 0, 
                    opacity: isScrollHidden ? 0 : 1 
                }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 30,
                    duration: 0.3 
                }}
                className={`
                    fixed top-0 left-0 right-0 z-50 
                    ${getTypeStyles()}
                    border-b shadow-lg backdrop-blur-sm
                    ${className}
                `}
            >
                <div className="max-w-full mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                        {/* Message Content */}
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-sm font-medium text-center leading-relaxed">
                                {message}
                            </p>
                        </div>

                        {/* Dismiss Button */}
                        {dismissible && (
                            <button
                                onClick={handleDismiss}
                                className="
                                    flex-shrink-0 p-1 rounded-full 
                                    hover:bg-black/10 dark:hover:bg-white/10 
                                    transition-colors duration-200
                                    focus:outline-none focus:ring-2 focus:ring-black/20
                                "
                                aria-label="Dismiss banner"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default StickyBanner;