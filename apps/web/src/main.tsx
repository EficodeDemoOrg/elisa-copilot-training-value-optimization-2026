import '@fontsource-variable/inter';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BoardPage } from './app/BoardPage';
import { ToastHost } from './components/ToastHost';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { refetchOnWindowFocus: false, staleTime: 30_000 },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<BoardPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
            <ToastHost />
        </QueryClientProvider>
    </React.StrictMode>,
);
