// frontend/src/utils/api.js
import axios from 'axios';

/**
 * Base API URL - change this for production
 */
const API_URL = import.meta.env.VITE_API_URL || 'https://taskmanager-webapp.onrender.com';

/**
 * Create axios instance with default config
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request interceptor to add auth token to headers
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle errors globally
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH APIs ====================

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} API response
 */
export const signup = async (userData) => {
  const response = await api.post('https://taskmanager-webapp.onrender.com/auth/signup', userData);
  return response.data;
};

/**
 * Login user
 * @param {Object} credentials - Email and password
 * @returns {Promise} API response
 */
export const login = async (credentials) => {
  const response = await api.post('https://taskmanager-webapp.onrender.com/auth/login', credentials);
  return response.data;
};

/**
 * Get user profile
 * @returns {Promise} API response
 */
export const getProfile = async () => {
  const response = await api.get('https://taskmanager-webapp.onrender.com/auth/profile');
  return response.data;
};

// ==================== TASK APIs ====================

/**
 * Get all tasks
 * @param {Object} params - Query parameters (status, priority, sort)
 * @returns {Promise} API response
 */
export const getTasks = async (params = {}) => {
  const response = await api.get('https://taskmanager-webapp.onrender.com/tasks', { params });
  return response.data;
};

/**
 * Get single task by ID
 * @param {string} id - Task ID
 * @returns {Promise} API response
 */
export const getTask = async (id) => {
  const response = await api.get(`https://taskmanager-webapp.onrender.com/tasks/${id}`);
  return response.data;
};

/**
 * Create a new task
 * @param {Object} taskData - Task data
 * @returns {Promise} API response
 */
export const createTask = async (taskData) => {
  const response = await api.post('https://taskmanager-webapp.onrender.com/tasks', taskData);
  return response.data;
};

/**
 * Update a task
 * @param {string} id - Task ID
 * @param {Object} taskData - Updated task data
 * @returns {Promise} API response
 */
export const updateTask = async (id, taskData) => {
  const response = await api.put(`https://taskmanager-webapp.onrender.com/tasks/${id}`, taskData);
  return response.data;
};

/**
 * Delete a task
 * @param {string} id - Task ID
 * @returns {Promise} API response
 */
export const deleteTask = async (id) => {
  const response = await api.delete(`https://taskmanager-webapp.onrender.com/tasks/${id}`);
  return response.data;
};

/**
 * Search tasks
 * @param {string} query - Search query
 * @returns {Promise} API response
 */
export const searchTasks = async (query) => {
  const response = await api.get(`https://taskmanager-webapp.onrender.com/tasks/search?q=${query}`);
  return response.data;
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Store authentication data
 * @param {string} token - JWT token
 * @param {Object} user - User object
 */
export const setAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Get stored user data
 * @returns {Object|null} User object or null
 */
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Logout user (clear storage)
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default api;