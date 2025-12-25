import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth tokens, logging, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    // Add authorization token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      console.error(`[API Error] ${error.response.status}:`, error.response.data);
      
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem('authToken');
          // window.location.href = '/login';
          break;
        case 403:
          console.error('Access forbidden');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Internal server error');
          break;
        default:
          break;
      }
    } else if (error.request) {
      // Request made but no response
      console.error('[API Error] No response received:', error.message);
    } else {
      // Error setting up request
      console.error('[API Error] Request setup failed:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// EMAIL API
// ============================================

/**
 * Generate AI-powered email
 * @param {Object} data - Email generation data
 * @param {File} data.eventImage - Event banner image (optional)
 * @param {string} data.context - Event context/description
 * @returns {Promise<Object>} Generated email with subject and body
 */
export const generateEmail = async (data) => {
  try {
    const formData = new FormData();
    
    if (data.eventImage) {
      formData.append('eventImage', data.eventImage);
    }
    
    if (data.context) {
      formData.append('context', data.context);
    }
    
    const response = await apiClient.post('/api/email/generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return {
      success: true,
      subject: response.data.subject,
      body: response.data.body,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 
      error.response?.data?.details || 
      'Failed to generate email'
    );
  }
};

/**
 * Send email (single or bulk)
 * @param {Object} data - Email sending data
 * @param {string} data.senderEmail - Sender's email address
 * @param {string} data.senderName - Sender's name
 * @param {string} data.subject - Email subject
 * @param {string} data.body - Email body (HTML supported)
 * @param {string} data.sendMode - "single" or "bulk"
 * @param {string} data.recipientEmail - Recipient email (for single mode)
 * @param {File} data.csvFile - CSV file with recipients (for bulk mode)
 * @param {File[]} data.attachments - Array of attachment files
 * @returns {Promise<Object>} Send result with success count
 */
export const sendEmail = async (data) => {
  try {
    const formData = new FormData();
    
    // Required fields
    formData.append('senderEmail', data.senderEmail);
    formData.append('senderName', data.senderName);
    formData.append('subject', data.subject);
    formData.append('body', data.body);
    formData.append('sendMode', data.sendMode);
    
    // Send mode specific fields
    if (data.sendMode === 'single') {
      formData.append('recipientEmail', data.recipientEmail);
      if (data.cc) formData.append('cc', data.cc);
      if (data.bcc) formData.append('bcc', data.bcc);
    } else if (data.sendMode === 'bulk' && data.csvFile) {
      formData.append('csvFile', data.csvFile);
    }
    
    // Attachments
    if (data.attachments && data.attachments.length > 0) {
      data.attachments.forEach((file, index) => {
        formData.append(`attachment${index}`, file);
      });
    }
    
    const response = await apiClient.post('/api/email/send', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds for email sending
    });
    
    return {
      success: true,
      message: response.data.message,
      successCount: response.data.successCount,
      failCount: response.data.failCount,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 
      error.response?.data?.details || 
      'Failed to send email'
    );
  }
};

// ============================================
// FILE CONVERSION API
// ============================================

/**
 * Convert file between formats (server-side)
 * Note: Most conversions are client-side, this is for heavy operations
 * @param {Object} data - Conversion data
 * @param {File} data.file - File to convert
 * @param {string} data.convertTo - Target format
 * @param {Object} data.options - Conversion options
 * @returns {Promise<Blob>} Converted file blob
 */
export const convertFile = async (data) => {
  try {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('convertTo', data.convertTo);
    
    if (data.options) {
      formData.append('options', JSON.stringify(data.options));
    }
    
    const response = await apiClient.post('/api/convert', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob', // Important for file download
      timeout: 120000, // 2 minutes for large files
    });
    
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 
      'Failed to convert file'
    );
  }
};

// ============================================
// DATA API (User Preferences, History)
// ============================================

/**
 * Get user data by session ID
 * @param {string} sessionId - User session ID
 * @returns {Promise<Object>} User data
 */
export const getUserData = async (sessionId) => {
  try {
    const response = await apiClient.get(`/api/data/${sessionId}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 
      'Failed to fetch user data'
    );
  }
};

/**
 * Save user data
 * @param {Object} data - User data to save
 * @param {string} data.sessionId - User session ID
 * @param {Object} data.preferences - User preferences
 * @param {Array} data.history - User history
 * @returns {Promise<Object>} Saved data
 */
export const saveUserData = async (data) => {
  try {
    const response = await apiClient.post('/api/data', data);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 
      'Failed to save user data'
    );
  }
};

/**
 * Delete user data
 * @param {string} sessionId - User session ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteUserData = async (sessionId) => {
  try {
    const response = await apiClient.delete(`/api/data/${sessionId}`);
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 
      'Failed to delete user data'
    );
  }
};

// ============================================
// HEALTH CHECK API
// ============================================

/**
 * Check server health
 * @returns {Promise<Object>} Server health status
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/api/health');
    return {
      success: true,
      status: response.data,
    };
  } catch (error) {
    throw new Error('Server is not responding');
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Upload file with progress tracking
 * @param {File} file - File to upload
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<Object>} Upload result
 */
export const uploadFile = async (file, onProgress) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (onProgress) {
          onProgress(percentCompleted);
        }
      },
    });
    
    return {
      success: true,
      fileUrl: response.data.fileUrl,
      fileName: response.data.fileName,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 
      'Failed to upload file'
    );
  }
};

/**
 * Download file from URL
 * @param {string} url - File URL
 * @param {string} filename - Download filename
 */
export const downloadFile = async (url, filename) => {
  try {
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });
    
    const blob = new Blob([response.data]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  } catch (error) {
    throw new Error('Failed to download file');
  }
};

// Export API client for custom requests
export { apiClient };

// Default export with all functions
export default {
  generateEmail,
  sendEmail,
  convertFile,
  getUserData,
  saveUserData,
  deleteUserData,
  checkHealth,
  uploadFile,
  downloadFile,
  apiClient,
};
