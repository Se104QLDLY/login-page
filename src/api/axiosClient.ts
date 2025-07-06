import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';

const axiosClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

// Optional: interceptor for common error handling
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // If not already on the login page, redirect
      if (!window.location.pathname.startsWith('/')) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient; 