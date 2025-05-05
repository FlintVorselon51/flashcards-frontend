import api from './api.jsx';

export const register = (userData) => {
    return api.post('/auth/register/', userData);
};

export const login = (credentials) => {
    return api.post('/auth/login/', credentials);
};

export const refreshToken = (refreshToken) => {
    return api.post('/auth/refresh/', { refresh: refreshToken });
};

export const isEmailAvailable = (email) => {
    return api.get(`/auth/is-email-available-for-registration/?email=${email}`);
};

export const changePassword = (data) => {
    return api.post('/auth/set-new-password-using-current/', data);
};
