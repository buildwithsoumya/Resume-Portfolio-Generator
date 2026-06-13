import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes for AI generation
});

/**
 * Upload a resume PDF and generate a portfolio.
 * @param {File} file - The PDF file to upload
 * @param {string} style - The chosen portfolio style key
 * @param {Function} onUploadProgress - Progress callback
 * @returns {Promise<{html: string, metadata: object}>}
 */
export const generatePortfolio = async (file, style, onUploadProgress) => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('style', style);

  const response = await apiClient.post('/generate', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percent);
      }
    },
  });

  return response.data;
};

/**
 * Health check for the backend.
 * @returns {Promise<boolean>}
 */
export const checkHealth = async () => {
  try {
    await apiClient.get('/health');
    return true;
  } catch {
    return false;
  }
};

export default apiClient;
