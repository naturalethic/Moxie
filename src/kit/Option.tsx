export type Option<T extends string | number> = T | { value: T; label: string };

export function optionValue<T extends string | number>(option: Option<T>): T {
    if (typeof option === "object") {
        return option.value;
    } else {
        return option as T;
    }
}

export function optionLabel<T extends string | number>(option: Option<T>) {
    if (typeof option === "object") {
        return option.label;
    } else {
        return option;
    }
}
