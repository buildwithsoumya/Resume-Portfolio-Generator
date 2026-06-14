import axios from 'axios';

// Base URL from environment — falls back to localhost:8000 for local dev
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2-minute timeout for AI generation
});

/**
 * Send a resume PDF and chosen style to the backend.
 * The backend returns { html: string, style: string }.
 *
 * @param {File}     file               - The PDF file object from the dropzone
 * @param {string}   style              - One of: developer | corporate | creative | modern-startup
 * @param {Function} [onUploadProgress] - Optional callback(percent: number)
 * @returns {Promise<{ html: string, style: string }>}
 */
export const generatePortfolio = async (file, style, onUploadProgress) => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('style', style);

  const response = await apiClient.post('/api/generate', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percent);
      }
    },
  });

  // Validate response shape — backend must return { html: string }
  const data = response.data;
  if (!data || typeof data.html !== 'string') {
    throw new Error('Backend returned an invalid response: missing html field.');
  }

  return data;
};