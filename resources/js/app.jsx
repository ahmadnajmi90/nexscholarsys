import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'NexScholar';

// Initialize any global service here if needed

createInertiaApp({
    title: (title) => {
        const finalTitle = title ? `${title} - ${appName}` : appName;
        // Force update the document title
        setTimeout(() => {
            document.title = finalTitle;
        }, 0);
        return finalTitle;
    },
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
