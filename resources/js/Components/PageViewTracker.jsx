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
            const pageTitle = props.title || document.title;
            
            // Log details to verify tracking info
            console.log(`PageViewTracker: ${component} at ${url} (${pageTitle})`);
            
            // Pass the URL to trackPageView - it will get other context like title from document
            trackPageView(url);
        }, 200); // Slightly longer delay to ensure title is updated
    }, [url, component]);
    
    return null; // This component doesn't render anything
} 