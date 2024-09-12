// src/services/apiClient.js
import axios from 'axios';
import store from '@/store';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(config => {
  // Retrieve the token from local storage or any global state management
  const token = localStorage.getItem('authToken'); // Example of token retrieval
  console.log("Bearer token ", token)
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
}, error => {
  return Promise.reject(error);
});


export default apiClient;
