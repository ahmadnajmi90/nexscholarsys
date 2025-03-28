/**
 * Google Analytics utility functions
 */

/**
 * Track a page view in Google Analytics
 * @param {string} path - The current page path
 */
export const trackPageView = (path) => {
    if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
        window.gtag('config', 'G-Q6VXXF3B0T', {
            page_path: path
        });
    }
};

/**
 * Track a custom event in Google Analytics
 * @param {string} category - Event category
 * @param {string} action - Event action
 * @param {string|null} label - Event label (optional)
 * @param {number|null} value - Event value (optional)
 */
export const trackEvent = (category, action, label = null, value = null) => {
    if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
        const eventParams = {
            event_category: category,
        };
        
        if (label) eventParams.event_label = label;
        if (value) eventParams.value = value;
        
        window.gtag('event', action, eventParams);
    }
}; 