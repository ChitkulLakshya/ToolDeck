/**
 * API Configuration
 * Centralized configuration for all API settings
 */

export const API_CONFIG = {
  // Base URLs
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  
  // Timeouts (in milliseconds)
  TIMEOUT: {
    DEFAULT: 30000,      // 30 seconds
    EMAIL: 60000,        // 60 seconds
    UPLOAD: 120000,      // 2 minutes
    CONVERSION: 120000,  // 2 minutes
  },
  
  // File size limits (in bytes)
  FILE_SIZE_LIMITS: {
    IMAGE: 5 * 1024 * 1024,        // 5MB
    ATTACHMENT: 10 * 1024 * 1024,  // 10MB total
    CONVERSION: 20 * 1024 * 1024,  // 20MB
  },
  
  // Supported formats
  SUPPORTED_FORMATS: {
    IMAGE: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    SPREADSHEET: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  },
  
  // API endpoints
  ENDPOINTS: {
    HEALTH: '/api/health',
    EMAIL: {
      GENERATE: '/api/email/generate',
      SEND: '/api/email/send',
    },
    CONVERT: '/api/convert',
    DATA: {
      GET: (sessionId) => `/api/data/${sessionId}`,
      SAVE: '/api/data',
      DELETE: (sessionId) => `/api/data/${sessionId}`,
    },
    UPLOAD: '/api/upload',
  },
  
  // Retry configuration
  RETRY: {
    ATTEMPTS: 3,
    DELAY: 1000, // 1 second
  },
  
  // Cache configuration
  CACHE: {
    ENABLED: true,
    TTL: 5 * 60 * 1000, // 5 minutes
  },
};

export default API_CONFIG;
