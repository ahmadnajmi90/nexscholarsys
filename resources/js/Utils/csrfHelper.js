import axios from 'axios';

/**
 * Check if the error is due to a CSRF token mismatch (419 status)
 *
 * @param {Error} error - The error object from axios
 * @returns {boolean} - Whether the error is due to CSRF token mismatch
 */
export const isSessionExpired = (error) => {
  return error?.response?.status === 419;
};

/**
 * Refresh the CSRF token by making a GET request to a Laravel route
 * that will set a fresh CSRF token in the response
 *
 * @returns {Promise<boolean>} - Whether the refresh was successful
 */
export const refreshCsrfToken = async () => {
  try {
    // Make a GET request to a simple endpoint to get a fresh CSRF token
    const response = await axios.get('/csrf/refresh');
    
    // Update the CSRF token in axios headers
    if (response.data.csrfToken) {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = response.data.csrfToken;
      
      // Also update the meta tag so other parts of the app can use it
      const metaTag = document.querySelector('meta[name="csrf-token"]');
      if (metaTag) {
        metaTag.setAttribute('content', response.data.csrfToken);
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to refresh CSRF token:', error);
    return false;
  }
};

/**
 * Handle a request that might have failed due to an expired CSRF token
 * First tries to refresh the token and then retries the original request
 *
 * @param {Function} requestFn - The original request function to retry
 * @returns {Promise<any>} - The result of the request
 */
export const handlePossibleSessionExpiration = async (requestFn) => {
  try {
    // First try the original request
    return await requestFn();
  } catch (error) {
    // If it's a CSRF token mismatch, try to refresh the token and retry
    if (isSessionExpired(error)) {
      const refreshSuccessful = await refreshCsrfToken();
      
      if (refreshSuccessful) {
        // Retry the original request with the new token
        try {
          return await requestFn();
        } catch (retryError) {
          // If it still fails, throw the error
          throw retryError;
        }
      } else {
        // If we couldn't refresh the token, throw a specific error
        throw new Error('Your session has expired. Please refresh the page and try again.');
      }
    }
    
    // For other errors, just rethrow
    throw error;
  }
}; 