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
        // Check if error is due to CSRF token mismatch (419 status)
        if (error.response && error.response.status === 419) {
            console.log('CSRF token mismatch detected. Attempting to refresh token...');
            
            try {
                // Get a fresh CSRF token
                const response = await axios.get('/csrf/refresh');
                
                if (response.data && response.data.csrfToken) {
                    // Update the token in Axios headers
                    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = response.data.csrfToken;
                    
                    // Update the meta tag
                    const metaTag = document.head.querySelector('meta[name="csrf-token"]');
                    if (metaTag) {
                        metaTag.setAttribute('content', response.data.csrfToken);
                    }
                    
                    // Retry the original request with new token
                    const originalRequest = error.config;
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                console.error('Failed to refresh CSRF token:', refreshError);
            }
        }
        
        // If we get here, we couldn't handle the error, so rethrow it
        return Promise.reject(error);
    }
);
