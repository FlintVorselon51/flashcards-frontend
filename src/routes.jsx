import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';

// Компоненты страниц
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DeckDetailsPage from './pages/DeckDetailsPage.jsx';
import CreateDeckPage from './pages/CreateDeckPage.jsx';
import StudySessionPage from './pages/StudySessionPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import Layout from './components/Layout.jsx';

// Защищенный маршрут
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const AppRoutes = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />

                        <Route path="decks/create" element={
                            <ProtectedRoute>
                                <CreateDeckPage />
                            </ProtectedRoute>
                        } />

                        <Route path="decks/:id" element={
                            <ProtectedRoute>
                                <DeckDetailsPage />
                            </ProtectedRoute>
                        } />

                        <Route path="decks/:id/study" element={
                            <ProtectedRoute>
                                <StudySessionPage />
                            </ProtectedRoute>
                        } />

                        <Route path="profile" element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        } />

                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default AppRoutes;
