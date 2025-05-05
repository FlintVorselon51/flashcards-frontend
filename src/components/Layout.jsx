import React, { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
    ThemeProvider,
    Button,
    Text,
    Container,
    Flex
} from '@gravity-ui/uikit';
import { AuthContext } from '../contexts/AuthContext';

const Layout = () => {
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    console.log('Auth state:', { isAuthenticated, user });

    return (
        <ThemeProvider theme="light">
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                width: '100%'
            }}>
                {/* Фиксированный хедер */}
                <header style={{
                    width: '100%',
                    padding: '16px 0',
                    borderBottom: '1px solid #eee',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}>
                    <Container>
                        <Flex justifyContent="space-between" alignItems="center">
                            <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                                <Text variant="header-1">Flashcards</Text>
                            </div>

                            <Flex gap="12">
                                {isAuthenticated ? (
                                    <Flex alignItems="center" gap="16">
                                        <Button
                                            view="flat"
                                            size="m"
                                            onClick={() => navigate('/profile')}
                                        >
                                            Профиль
                                        </Button>
                                        <Button
                                            view="outlined"
                                            size="m"
                                            onClick={handleLogout}
                                        >
                                            Выйти
                                        </Button>
                                    </Flex>
                                ) : (
                                    <>
                                        <Button
                                            view="outlined"
                                            size="m"
                                            onClick={() => navigate('/register')}
                                        >
                                            Регистрация
                                        </Button>
                                        <Button
                                            view="action"
                                            size="m"
                                            onClick={() => navigate('/login')}
                                        >
                                            Войти
                                        </Button>
                                    </>
                                )}
                            </Flex>
                        </Flex>
                    </Container>
                </header>

                <main style={{ flex: 1, width: '100%', padding: '24px 0' }}>
                    <Container>
                        <Outlet />
                    </Container>
                </main>

                <footer style={{
                    width: '100%',
                    padding: '20px 0',
                    borderTop: '1px solid #eee',
                    backgroundColor: 'white',
                    textAlign: 'center'
                }}>
                    <Container>
                        <Text variant="body-3">© 2025 Flashcards App. All rights reserved.</Text>
                    </Container>
                </footer>
            </div>
        </ThemeProvider>
    );
};

export default Layout;
