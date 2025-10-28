/**
 * API Module
 * Centralized exports for all API-related functions
 */

export {
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
} from './api';

export { API_CONFIG } from './config';

export {
  APIError,
  handleAPIError,
  logError,
  retryRequest,
} from './errorHandler';

// Default export
import api from './api';
export default api;
