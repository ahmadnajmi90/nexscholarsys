import axios from 'axios';

/**
 * Check if the error is due to a CSRF token mismatch (419 status) or a session expiration
 *
 * @param {Error} error - The error object from axios
 * @returns {boolean} - Whether the error is due to CSRF token mismatch
 */
export const isSessionExpired = (error) => {
  // Check for our custom property added by the interceptor
  if (error?.isSessionExpired) {
    return true;
  }
  
  // Check for 419 status directly
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
    // Create a separate axios instance to avoid interceptor loop
    const tokenAxios = axios.create();
    
    // Make a GET request to a simple endpoint to get a fresh CSRF token
    const response = await tokenAxios.get('/csrf/refresh');
    
    // Update the CSRF token in axios headers
    if (response.data.csrfToken) {
      const newToken = response.data.csrfToken;
      
      // Update global axios instance
      axios.defaults.headers.common['X-CSRF-TOKEN'] = newToken;
      
      // Also update the meta tag so other parts of the app can use it
      const metaTag = document.querySelector('meta[name="csrf-token"]');
      if (metaTag) {
        metaTag.setAttribute('content', newToken);
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
 * This is a standalone helper function and doesn't rely on the axios interceptor
 *
 * @param {Function} requestFn - The original request function to retry
 * @param {number} maxRetries - Maximum number of retries, defaults to 1
 * @returns {Promise<any>} - The result of the request
 */
export const handlePossibleSessionExpiration = async (requestFn, maxRetries = 1) => {
  let retries = 0;
  
  const executeRequest = async () => {
    try {
      // Try the request
      return await requestFn();
    } catch (error) {
      // If it's a CSRF token mismatch, try to refresh the token and retry
      if (isSessionExpired(error) && retries < maxRetries) {
        retries++;
        console.log(`CSRF token mismatch detected. Manual retry attempt ${retries}`);
        
        const refreshSuccessful = await refreshCsrfToken();
        
        if (refreshSuccessful) {
          console.log('Token refreshed, retrying request...');
          // Retry the request
          return executeRequest();
        } else {
          // If we couldn't refresh the token, throw a specific error
          const sessionError = new Error('Your session has expired. Please refresh the page and try again.');
          sessionError.isSessionExpired = true;
          throw sessionError;
        }
      }
      
      // For other errors or if we've hit the retry limit, just rethrow
      throw error;
    }
  };
  
  return executeRequest();
}; 