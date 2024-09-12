// src/services/AuthService.js
import apiClient from './apiClient';

export class AuthService {

  login(credentials) {
    return apiClient.post('/auth/login', credentials)
      .then(response => {
        // Store token in local storage
        console.log("token ", response.data.data.token);
        localStorage.setItem('authToken', response.data.data.token); // Adjust based on your API response
        return response.data;
      });
  }

  forgetPassword(credentials){
    return apiClient.post('/auth/forgot-password', credentials)
      .then(response => response.data);
  };

  resetPassword(credentials){
    return apiClient.post('/auth/reset-password', credentials)
      .then(response => response.data);
  };
}
