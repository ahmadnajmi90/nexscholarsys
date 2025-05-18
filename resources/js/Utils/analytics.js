/**
 * Google Analytics utility functions
 */

// Get measurement ID from window global
const getMeasurementId = () => {
    if (typeof window !== 'undefined' && window.gaConfig && window.gaConfig.measurementId) {
        return window.gaConfig.measurementId;
    }
    return 'G-Q6VXXF3B0T'; // Fallback to hardcoded value if not set
};

/**
 * Determine if analytics should be tracked on current domain
 * This is more robust than just checking for localhost
 */
const shouldTrack = () => {
    if (typeof window === 'undefined' || typeof window.gtag === 'undefined') {
        return false;
    }
    
    const hostname = window.location.hostname;
    
    // Don't track on development environments
    if (hostname === 'localhost' || 
        hostname === '127.0.0.1' || 
        hostname.includes('.test') || 
        hostname.includes('.local')) {
        return false;
    }
    
    // Check for production domain explicitly
    // This ensures we only track on the actual production domain
    const isProduction = hostname === 'nexscholar.com' || 
                         hostname.endsWith('.nexscholar.com');
                         
    return isProduction;
};

/**
 * Track a page view in Google Analytics
 * @param {string} path - The current page path
 * @param {string} [explicitTitle] - Optional explicit page title to use
 */
export const trackPageView = (path, explicitTitle = null) => {
    if (shouldTrack()) {
        // Get current page details
        const pageTitle = explicitTitle || document.title;
        const pageLocation = window.location.href;
        const pagePath = path || window.location.pathname + window.location.search;
        const measurementId = getMeasurementId();
        
        console.log(`GA Tracking pageview: ${pagePath} (${pageTitle})`); // Debugging
        
        // First, update the configuration with current page info
        window.gtag('config', measurementId, {
            page_title: pageTitle,
            page_location: pageLocation,
            page_path: pagePath,
            send_page_view: false // Don't send a page view yet
        });
        
        // Then explicitly send a page_view event with the same parameters
        // This is critical for SPA tracking in GA4
        window.gtag('event', 'page_view', {
            // Include ALL parameters directly in the event
            title: pageTitle,
            page_title: pageTitle,
            location: pageLocation,
            page_location: pageLocation,
            path: pagePath,
            page_path: pagePath,
            send_to: measurementId
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
    if (shouldTrack()) {
        console.log(`GA Tracking event: ${category}/${action}`); // Debugging
        const eventParams = {
            event_category: category,
        };
        
        if (label) eventParams.event_label = label;
        if (value) eventParams.value = value;
        
        window.gtag('event', action, eventParams);
    }
}; 