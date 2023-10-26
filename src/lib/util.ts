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
