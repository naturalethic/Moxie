export type Option<T extends string = string> =
    | string
    | { value: T; label: string };

export function optionValue<T extends string>(option: Option<T>): T {
    if (typeof option === "string") {
        return option as T;
    } else {
        return option.value;
    }
}

export function optionLabel<T extends string>(option: Option<T>) {
    if (typeof option === "string") {
        return option;
    } else {
        return option.label;
    }
}
