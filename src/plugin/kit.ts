import { readdirSync, readFileSync } from "fs";
import { pascal } from "radash";
import { Plugin } from "vite";

export default function kit(): Plugin {
    const virtualModuleId = "kit:components";
    const resolvedVirtualModuleId = `\0${virtualModuleId}`;

    return {
        name: "moxie:kit",
        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId;
            }
        },

        load(id) {
            if (id === resolvedVirtualModuleId) {
                return `export default ${JSON.stringify(validComponents())}`;
            }
        },

        handleHotUpdate({ file, server, modules }) {
            if (/src\/kit\/.*\.tsx$/.test(file)) {
                modules.push(
                    server.moduleGraph.getModuleById(resolvedVirtualModuleId)!,
                );
            }
        },
    };
}

function validComponents() {
    return readdirSync("src/kit")
        .filter((it) => it.endsWith(".tsx"))
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
        });
}
