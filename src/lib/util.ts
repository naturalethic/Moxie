/**
 * Concatenates the provided classes into a single string.
 *
 * @param classes - An array of classes to be concatenated. Classes can be of type string, boolean, undefined, or an object.
 * @returns A string containing all the concatenated classes.
 *
 * @example
 * @import.meta.vitest
 * ```ts
 * expect(cls("button", "primary")).toEqual("button primary")
 * expect(cls({ active: true, disabled: false }, "large")).toEqual("active large")
 * expect(cls(false && "button", { active: true, disabled: false }, "large")).toEqual("active large")
 * ```
 */
export function cls(
    ...classes: (string | boolean | undefined | Record<string, unknown>)[]
) {
    return classes
        .filter((x) => x)
        .flatMap((x) => {
            if (typeof x === "string") {
                return [x];
            } else {
                return Object.entries(x!).map(([k, v]) => (v ? k : ""));
            }
        })
        .filter((x) => x)
        .join(" ");
}

/**
 * Sets the value at the specified path in an object.
 *
 * @param {Record<string, unknown>} object - The object to modify.
 * @param {string | string[]} path - The path to set the value at.
 * @param {unknown} value - The value to set.
 * @example
 * @import.meta.vitest
 * ```ts
 * expect(setPath({ a: { b: 1 } }, "a.b", 2)).toEqual({ a: { b: 2 } })
 * expect(setPath({ a: {} }, "a.b.c", 3)).toEqual({ a: { b: { c: 3 } } })
 * ```
 */
export function setPath<T extends Record<string, unknown>>(
    object: T,
    path: string | string[],
    value: unknown,
) {
    const parts = typeof path === "string" ? path.split(".") : path;
    const next = parts.shift();
    if (!next) {
        console.warn("setPath: missing path");
        return object;
    }
    if (parts.length === 0) {
        // @ts-ignore
        object[next] = value;
    } else {
        if (!object[next]) {
            // @ts-ignore
            object[next] = {};
        }
        setPath(
            object[next] as Record<string, unknown>,
            parts.join("."),
            value,
        );
    }
    return object;
}
