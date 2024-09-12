import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(() => {
    return {
        plugins: [vue()],
        base: '/frontend/',
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        optimizeDeps: {
            include: ['fast-deep-equal'],
        },
        server: {
            proxy: {
                '/api': {
                    target: 'https://api-v2-dev.farm2feed.com', // Replace with your API base URL
                    changeOrigin: true,
                    secure: false, // Add this if you have issues with HTTPS (optional)
                    rewrite: (path) => {
                        console.log(`Proxying request to: ${path}`); // Debug log
                        return path.replace(/^\/api/, ''); // Rewrite path as needed
                    },
                },
            },
        },
    };
});
