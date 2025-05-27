import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Configure Axios to read the CSRF token from the meta tag
const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

if (csrfToken) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
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
            
            try {
                // Create a separate axios instance for this request to avoid
                // another interception if this refresh call itself fails
                const tokenAxios = axios.create();
                
                // Get a fresh CSRF token
                const response = await tokenAxios.get('/csrf/refresh');
                
                if (response.data && response.data.csrfToken) {
                    const newToken = response.data.csrfToken;
                    
                    // Update the token in Axios headers
                    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = newToken;
                    originalRequest.headers['X-CSRF-TOKEN'] = newToken;
                    
                    // Update the meta tag
                    const metaTag = document.head.querySelector('meta[name="csrf-token"]');
                    if (metaTag) {
                        metaTag.setAttribute('content', newToken);
                    }
                    
                    console.log('CSRF token refreshed successfully. Retrying original request...');
                    
                    // Retry the original request with new token
                    return axios(originalRequest);
                } else {
                    console.error('Invalid response from CSRF refresh endpoint');
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

