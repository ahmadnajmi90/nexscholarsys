import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { trackPageView } from '../Utils/analytics';

/**
 * Component that tracks page views in Google Analytics
 * Use this in layouts that don't use MainLayout
 * 
 * Important: This tracks page views for Inertia.js SPAs by
 * sending a 'page_view' event with title and path data
 */
export default function PageViewTracker() {
    const { url, component, props } = usePage();
    
    useEffect(() => {
        // Add a small delay to ensure both GA has loaded
        // and the document title has been updated by Inertia
        setTimeout(() => {
            // By this time, the Head component should have updated the title
            // but we also verify from Inertia props if available
            let pageTitle = props.title || document.title;
            
            // If still no meaningful title (especially for SEO URLs), try to extract from URL
            if (!pageTitle || pageTitle === 'Nexscholar' || pageTitle.endsWith('- Nexscholar')) {
                // Extract title from SEO URL if available
                const urlPath = url.split('/').filter(Boolean);
                if (urlPath.length > 0) {
                    const lastSegment = urlPath[urlPath.length - 1];
                    // Convert slug to title case: money-matters-how -> Money Matters How
                    const extractedTitle = lastSegment
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                    
                    if (extractedTitle) {
                        pageTitle = extractedTitle;
                    }
                }
            }
            
            // Log details to verify tracking info
            console.log(`PageViewTracker: ${component} at ${url} (${pageTitle || 'Unknown'})`);
            
            // Force document title if it doesn't match the intended title
            // This helps ensure GA gets the right title
            if (document.title !== pageTitle && pageTitle) {
                document.title = pageTitle;
            }
            
            // Pass the URL to trackPageView along with explicit title
            // for cases where document.title might not be set properly
            trackPageView(url, pageTitle);
        }, 250); // Slightly longer delay to ensure title is updated
    }, [url, component, props.title]);
    
    return null; // This component doesn't render anything
} 