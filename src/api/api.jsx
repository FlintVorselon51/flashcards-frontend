// src/api/api.js
import axios from 'axios';

const API_URL = 'http://localhost:80';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.data || error.message);

        // Если токен не валиден, перенаправляем на страницу логина
        if (error.response && error.response.status === 401) {
            console.log('Authentication error, redirecting to login');
            // Можно добавить код для перенаправления или очистки localStorage
        }

        return Promise.reject(error);
    }
);

export default api;
