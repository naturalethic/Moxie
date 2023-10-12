import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:8080/admin",
                changeOrigin: true,
            },
        },
    },
});