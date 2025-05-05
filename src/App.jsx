import React from 'react';
import { ThemeProvider } from '@gravity-ui/uikit';
import AppRoutes from './routes.jsx';
import './styles.css'; // Для общих стилей, если они понадобятся

function App() {
    return (
        <ThemeProvider theme="light">
            <AppRoutes />
        </ThemeProvider>
    );
}

export default App;
