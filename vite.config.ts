import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
//  https://code-snippet-app-backend-55o5.onrender.com
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            "/api": {
                target: "https://code-snippet-app-backend-55o5.onrender.com",
                changeOrigin: false,
            }
        }
    }
});
