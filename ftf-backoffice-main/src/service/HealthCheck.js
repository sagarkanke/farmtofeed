import apiClient from './apiClient';

export const fetchHealthStatus = () => {
    return apiClient.get(import.meta.env.VITE_HEALTH_CHECK_URL)
        .then(response => response.data)
        .catch(error => {
            console.error('Error checking health:', error);
            throw error;
        });
};