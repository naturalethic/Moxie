import { Plugin } from "vite";
import { readFileSync } from "fs";

/**
 * This plugin forces all css files to be module css, except src/index.css
 */
export default function css(): Plugin {
    return {
        name: "moxie:css",
        enforce: "pre",
        async resolveId(id: string, importer: string, options: object) {
            if (id.endsWith(".css")) {
                if (id.includes("node_modules")) {
                    return;
                }
                const resolved = await this.resolve(id, importer, {
                    skipSelf: true,
                    ...options,
                });
                if (resolved.id.endsWith("src/index.css")) {
                    return;
                }
                return `${resolved.id.substring(
                    0,
                    resolved.id.length - 4,
                )}.module.css`;
            }
        },

        async load(id) {
            if (id.endsWith("module.css")) {
                return readFileSync(id.replace("module.css", "css"), "utf-8");
            }
        },
    };
}
