import { loadEnv } from "vite";
import { doctest } from "vite-plugin-doctest";
import solid from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

process.env = { ...process.env, ...loadEnv("dev", process.cwd()) };

export default defineConfig({
    plugins: [tsconfigPaths(), solid(), doctest()],
    test: { includeSource: ["src/**/*.{ts,tsx}"] },
    build: {
        target: "esnext",
        cssMinify: false,
        minify: false,
        modulePreload: {
            polyfill: false,
        },
        rollupOptions: {
            output: {
                entryFileNames: "[name].js",
                chunkFileNames: "[name].js",
                assetFileNames: "[name].[ext]",
            },
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
