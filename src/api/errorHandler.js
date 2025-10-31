/**
 * API Error Handler
 * Centralized error handling and user-friendly messages
 */

export class APIError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Handle API errors and return user-friendly messages
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const handleAPIError = (error) => {
  // Network errors
  if (!error.response) {
    return 'Network error. Please check your internet connection.';
  }

  // Server errors
  const status = error.response?.status;
  const data = error.response?.data;

  switch (status) {
    case 400:
      return data?.error || 'Invalid request. Please check your input.';
    case 401:
      return 'Unauthorized. Please log in again.';
    case 403:
      return 'Access forbidden. You don\'t have permission.';
    case 404:
      return 'Resource not found.';
    case 413:
      return 'File too large. Please reduce file size.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    case 503:
      return 'Service unavailable. Please try again later.';
    default:
      return data?.error || data?.message || 'An unexpected error occurred.';
  }
};

/**
 * Log error to console (development) or monitoring service (production)
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 */
export const logError = (error, context = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('[API Error]', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      context,
    });
  } else {
    // Send to monitoring service (e.g., Sentry, LogRocket)
    // Sentry.captureException(error, { extra: context });
  }
};

/**
 * Retry failed requests
 * @param {Function} fn - Function to retry
 * @param {number} attempts - Number of retry attempts
 * @param {number} delay - Delay between retries (ms)
 * @returns {Promise} Result of function
 */
export const retryRequest = async (fn, attempts = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (attempts <= 1) {
      throw error;
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryRequest(fn, attempts - 1, delay * 2);
  }
};

export default {
  APIError,
  handleAPIError,
  logError,
  retryRequest,
};
