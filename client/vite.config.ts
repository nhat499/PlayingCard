import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "VITE_");
    return {
        plugins: [react()],
        server: {
            proxy: {
                "/api": {
                    target: env.VITE_API_URL || "http://localhost:3000",
                    changeOrigin: true,
                    secure: false, // allow self-signed SSL certificates if needed
                },
            },
        },
    };
});
