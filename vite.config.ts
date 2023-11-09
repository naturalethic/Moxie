import { doctest } from "vite-plugin-doctest";
import solid from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";
import kit from "./src/plugin/kit";

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        solid(),
        doctest(),
        kit(),
        // restart({
        //     restart: ["src/kit/*.tsx"],
        // }),
    ],
    test: {
        root: "src",
        includeSource: ["**/*.{ts,tsx}"],
        include: [],
        cache: {
            dir: "../node_modules/.vitest",
        },
    },
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
