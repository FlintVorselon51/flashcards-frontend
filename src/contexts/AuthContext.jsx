// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, refreshToken as apiRefreshToken } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Проверяем, авторизован ли пользователь
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Здесь можно также проверить срок действия токена
                    // и при необходимости обновить его через refreshToken
                    const userEmail = localStorage.getItem('userEmail');
                    if (userEmail) {
                        setUser({ email: userEmail });
                    }
                } catch (error) {
                    console.error('Authentication error:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('userEmail');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await apiLogin({ email, password });

            // Адаптируемся к разным форматам ответа API
            const token = response.data.access || response.data.token || response.data.accessToken;
            const refreshTokenValue = response.data.refresh || response.data.refresh_token;

            // Сохраняем только необходимые данные
            localStorage.setItem('token', token);
            if (refreshTokenValue) {
                localStorage.setItem('refresh_token', refreshTokenValue);
            }
            localStorage.setItem('userEmail', email);

            // Устанавливаем пользователя в контекст
            setUser({ email });
            setError(null);

            console.log('Login successful:', { email, token });
            return { email };
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.detail || 'Login failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('userEmail');
        setUser(null);
    };

    const register = async (userData) => {
        // Регистрация и получение токена обрабатываются вне контекста
        // Функция добавлена для удобства использования
        return userData;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                login,
                logout,
                register,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
