import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { trackPageView } from '../Utils/analytics';

/**
 * Component that tracks page views in Google Analytics
 * Use this in layouts that don't use MainLayout
 */
export default function PageViewTracker() {
    const { url } = usePage();
    
    useEffect(() => {
        trackPageView(url);
    }, [url]);
    
    return null; // This component doesn't render anything
} 