import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Configure Axios to read the CSRF token from the meta tag
function getCsrfToken() {
    return document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
}

const csrfToken = getCsrfToken();

if (csrfToken) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    console.log('Initial CSRF token loaded:', csrfToken.substring(0, 20) + '...');
} else {
    console.warn('CSRF token not found initially. This may cause issues with POST requests.');
}

// Global interceptor to handle CSRF token expiration
window.axios.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        
        // Check if error is due to CSRF token mismatch (419 status)
        // And make sure we're not already retrying or haven't exceeded retry limit
        if (error.response && 
            error.response.status === 419 && 
            !originalRequest._retry &&
            (originalRequest._retryCount || 0) < 1) { // Only retry once
            
            // Mark that we're retrying this request and increment retry counter
            originalRequest._retry = true;
            originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
            
            console.log('CSRF token mismatch detected. Attempting to refresh token... (Attempt ' + originalRequest._retryCount + ')');
            console.log('Original request URL:', originalRequest.url);
            console.log('Original request method:', originalRequest.method);
            
            try {
                // Create a separate axios instance for this request to avoid
                // another interception if this refresh call itself fails
                const tokenAxios = axios.create();
                
                // Get a fresh CSRF token
                const response = await tokenAxios.get('/csrf/refresh');

                if (response.data && response.data.csrfToken && response.data.success === true) {
                    const newToken = response.data.csrfToken;

                    // Update the token in Axios headers
                    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = newToken;
                    originalRequest.headers['X-CSRF-TOKEN'] = newToken;

                    // Update the meta tag
                    const metaTag = document.head.querySelector('meta[name="csrf-token"]');
                    if (metaTag) {
                        metaTag.setAttribute('content', newToken);
                        console.log('Meta tag updated with new CSRF token');
                    }

                    console.log('CSRF token refreshed successfully. Retrying original request...');

                    // Add a small delay to ensure token propagation
                    await new Promise(resolve => setTimeout(resolve, 100));

                    // Retry the original request with new token
                    return axios(originalRequest);
                } else if (response.data && response.data.error) {
                    console.error('CSRF refresh failed:', response.data.message);
                    return Promise.reject(new Error(response.data.message));
                } else {
                    console.error('Invalid response from CSRF refresh endpoint:', response.data);
                    return Promise.reject(new Error('Failed to refresh CSRF token - invalid response'));
                }
            } catch (refreshError) {
                console.error('Failed to refresh CSRF token:', refreshError);
                
                // Create a more user-friendly error message
                const sessionError = new Error('Your session has expired. Please refresh the page and try again.');
                sessionError.isSessionExpired = true;
                
                return Promise.reject(sessionError);
            }
        }
        
        // If we've reached max retries and still getting 419, provide a clear message
        if (error.response && 
            error.response.status === 419 && 
            originalRequest._retryCount >= 1) {
            console.error('CSRF token refresh failed after maximum retries');
            
            const sessionError = new Error('Your session has expired. Please refresh the page and try again.');
            sessionError.isSessionExpired = true;
            
            return Promise.reject(sessionError);
        }
        
        // For any other errors, just rethrow
        return Promise.reject(error);
    }
);

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allow your team to quickly build robust real-time web applications.
 */

import './echo';
