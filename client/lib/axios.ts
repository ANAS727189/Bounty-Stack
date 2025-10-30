import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
    });

    axiosInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
        const message = error.response.data?.message || 'An error occurred';
        return Promise.reject(new Error(message));
        } else if (error.request) {
        return Promise.reject(new Error('No response from server'));
        } else {
        return Promise.reject(error);
        }
    }
);

export default axiosInstance;