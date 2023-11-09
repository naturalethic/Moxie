import { readdirSync, readFileSync } from "fs";
import { pascal } from "radash";
import { loadEnv } from "vite";
import { doctest } from "vite-plugin-doctest";
import solid from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

if (process.env.NODE_ENV === "development") {
    process.env = { ...process.env, ...loadEnv("dev", process.cwd()) };
    process.env.VITE_KIT = JSON.stringify(
        readdirSync("src/kit")
            .map((it) => it.replace(".tsx", ""))
            .filter((it) => !["index"].includes(it))
            .filter((it) => {
                const name = pascal(it);
                const source = readFileSync(`src/kit/${it}.tsx`, "utf-8");
                const missing: string[] = [];
                if (RegExp(`export const ${name}Lab = null`).test(source)) {
                    return false;
                }
                if (!RegExp(`export const ${name}[:\\s]`).test(source)) {
                    missing.push(name);
                }
                if (!RegExp(`export const ${name}Props\\s`).test(source)) {
                    missing.push(`${name}Props`);
                }
                if (missing.length > 0) {
                    console.warn(
                        `src/kit/${it}.tsx: Missing ${missing.join(", ")}`,
                    );
                }
                return missing.length === 0;
            }),
    );
}

export default defineConfig({
    plugins: [tsconfigPaths(), solid(), doctest()],
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
