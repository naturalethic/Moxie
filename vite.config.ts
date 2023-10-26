import { doctest } from "vite-plugin-doctest";
import solid from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

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
            "/api": {
                target: "http://localhost:8080/admin",
                changeOrigin: true,
            },
        },
    },
});
