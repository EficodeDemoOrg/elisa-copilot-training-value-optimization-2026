/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                midnight: {
                    DEFAULT: '#0B1020',
                    surface: '#141A33',
                    elevated: '#1B2347',
                    border: 'rgba(255,255,255,0.06)',
                },
                ink: {
                    DEFAULT: '#E6E9F5',
                    muted: '#A4ABC9',
                    dim: '#6E769A',
                },
                accent: {
                    DEFAULT: '#E6398A',
                    hover: '#FF6FB3',
                    pressed: '#9E1F5E',
                    glow: 'rgba(230, 57, 138, 0.35)',
                },
                success: '#3DDC97',
                warning: '#F2C14E',
                danger: '#FF5A6E',
            },
            fontFamily: {
                sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                card: '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(0,0,0,0.35)',
                glow: '0 0 0 2px rgba(230, 57, 138, 0.45)',
            },
            borderRadius: {
                xl: '12px',
                '2xl': '16px',
            },
            transitionTimingFunction: {
                'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
            },
        },
    },
    plugins: [],
};
