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

/**
 * Retrieves the value of a nested property in an object based on a given path.
 *
 * @param {Record<string, unknown>} object - The object to retrieve the property from.
 * @param {string | string[]} path - The path to the nested property. Can be a dot-separated string or an array of strings.
 * @return {unknown} - The value of the nested property. Returns undefined if the property does not exist.
 * @example
 * @import.meta.vitest
 * ```ts
 * expect(getPath({ a: { b: 1 } }, "a.b")).toEqual(1);
 * expect(getPath({ a: {} }, "a.b.c")).toBeUndefined();
 * ```
 */
export function getPath<
    R,
    T extends Record<string, unknown> = Record<string, unknown>,
>(object: T, path: string | string[]): R | undefined {
    const parts = typeof path === "string" ? path.split(".") : path;
    const next = parts.shift();
    if (!next) {
        console.warn("getPath: missing path");
        return undefined;
    }
    if (parts.length === 0) {
        // @ts-ignore
        return object[next];
    } else {
        if (!object[next]) {
            return undefined;
        }
        return getPath(object[next] as Record<string, unknown>, parts);
    }
}
