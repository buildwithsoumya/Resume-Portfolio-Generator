import axios from 'axios';
import { getToken } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

// Attach JWT to every request when available
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Generate a portfolio from a resume PDF.
 * When a user is logged in, the result is also saved to the DB.
 *
 * @param {File}     file               - PDF file from dropzone
 * @param {string}   style              - developer | corporate | creative | modern-startup
 * @param {Function} [onUploadProgress] - callback(percent: number)
 * @returns {Promise<{ html: string, style: string, portfolio_id: number|null }>}
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

  const data = response.data;
  if (!data || typeof data.html !== 'string') {
    throw new Error('Backend returned an invalid response: missing html field.');
  }
  return data;
};

/**
 * Fetch the authenticated user's portfolio list (no html_content).
 * @returns {Promise<Array>}
 */
export const fetchPortfolios = async () => {
  const { data } = await apiClient.get('/portfolios/');
  return data;
};

/**
 * Fetch a single portfolio by id (includes html_content).
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const fetchPortfolioById = async (id) => {
  const { data } = await apiClient.get(`/portfolios/${id}`);
  return data;
};

/**
 * Update an existing portfolio with new edited HTML.
 * @param {number} id 
 * @param {string} edited_html 
 * @returns {Promise<Object>}
 */
export const updatePortfolio = async (id, edited_html) => {
  const { data } = await apiClient.put(`/portfolios/${id}`, { edited_html });
  return data;
};

/**
 * Delete a portfolio by id.
 * @param {number} id
 */
export const deletePortfolio = async (id) => {
  await apiClient.delete(`/portfolios/${id}`);
};

export default apiClient;