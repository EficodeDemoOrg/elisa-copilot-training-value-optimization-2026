import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const WEB_PORT = Number(process.env.WEB_PORT ?? 5890);
const API_PORT = Number(process.env.API_PORT ?? 5891);

export default defineConfig({
    plugins: [react()],
    server: {
        port: WEB_PORT,
        strictPort: true,
        proxy: {
            '/api': {
                target: `http://localhost:${API_PORT}`,
                changeOrigin: true,
            },
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
    },
});
