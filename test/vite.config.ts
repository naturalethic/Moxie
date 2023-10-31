import { loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

process.env = { ...process.env, ...loadEnv("dev", process.cwd()) };

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        include: ["**/*.{ts,tsx}"],
        exclude: ["vite.config.ts"],
        cache: {
            dir: "../node_modules/.vitest",
        },
    },
    server: {
        proxy: {
            "/mox": {
                target:
                    process.env.VITE_SERVER_PROXY ?? "http://localhost:1080",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/mox/, ""),
            },
        },
    },
});
