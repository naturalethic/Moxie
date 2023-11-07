import { modifyMutable, reconcile } from "solid-js/store";
import { AnyObjectSchema, Infer, StringSchema } from "./schema";

export type ValidationError = {
    [key: string]: ValidationError | string | undefined;
};

export function validate<S extends AnyObjectSchema, V extends Infer<S>>(
    schema: S,
    value: Partial<V>,
    error: ValidationError,
): boolean {
    modifyMutable(error, reconcile({}));
    for (const [key, entrySchema] of Object.entries(schema.entries)) {
        if (Object.hasOwn(value, key)) {
            if (entrySchema.type === "object") {
                const entryObjectSchema = entrySchema as AnyObjectSchema;
                const entryValue = value[
                    key
                ] as unknown as Infer<AnyObjectSchema>;
                error[key] = {};
                if (
                    !validate(
                        entryObjectSchema,
                        entryValue,
                        error[key] as ValidationError,
                    )
                ) {
                    delete error[key];
                }
            }
            if (entrySchema.type === "string") {
                const entryStringSchema = entrySchema as StringSchema;
                for (const validator of entryStringSchema.validations) {
                    const message = validator(value[key] as string);
                    if (message) {
                        error[key] = message;
                    }
                }
                // if (entryStringSchema.options.required && !value[key]) {
                //     error[key] = "Required";
                // }
            }
        }
    }
    return Object.keys(error).length === 0;
}

export function required() {
    return function (value: unknown) {
        if (
            (typeof value === "string" && !value) ||
            value === undefined ||
            value === null
        ) {
            return "Required";
        }
    };
}

export function min(min: number, message?: string) {
    return function (value: unknown) {
        if (typeof value === "number" && value < min) {
            if (message) {
                return message;
            }
            return `Must be at least ${min}`;
        }
        if (typeof value === "string" && value.length < min) {
            if (message) {
                return message;
            }
            return `Must be at least ${min} characters`;
        }
    };
}
