import { ConditionalExcept, ConditionalPick, Simplify } from "type-fest";

type SchemaType =
    | "boolean"
    | "string"
    | "object"
    | "variant"
    | "special"
    | "optional";

export type Schema<T extends SchemaType> = {
    type: T;
};

export type AnySchema = Schema<SchemaType>;

export function boolean(): Schema<"boolean"> {
    return {
        type: "boolean",
    };
}

type StringOptions = {
    required?: boolean;
};

type StringSchema = Schema<"string"> & {
    options: StringOptions;
};

export function string({ required = false }: StringOptions = {}): StringSchema {
    return {
        type: "string",
        options: {
            required,
        },
    };
}

type ObjectEntries = Record<string, AnySchema>;

type ObjectSchema<E extends ObjectEntries> = Schema<"object"> & {
    entries: E;
};

export function object<E extends ObjectEntries>(entries: E): ObjectSchema<E> {
    return {
        type: "object",
        entries,
    };
}

type VariantSchema<T extends string> = Schema<"variant"> & {
    variant: Record<T, T>;
};

export function variant<T extends string>(...items: T[]): VariantSchema<T> {
    const map: { [key: string]: string } = {};
    for (const item of items) {
        map[item] = item;
    }
    return {
        type: "variant",
        variant: Object.freeze(map) as Record<T, T>,
    };
}

type SpecialSchema<T> = Schema<"special"> & {
    _marker: T;
};

export function special<T>(): SpecialSchema<T> {
    return {
        type: "special",
        _marker: {} as T,
    };
}

type OptionalSchema<E extends Exclude<AnySchema, { type: "optional" }>> = {
    type: "optional";
    entry: E;
};

export function optional<E extends Exclude<AnySchema, { type: "optional" }>>(
    entry: E,
): OptionalSchema<E> {
    return {
        type: "optional",
        entry,
    };
}

export type Infer<S extends AnySchema> = S["type"] extends "string"
    ? string
    : S["type"] extends "boolean"
    ? boolean
    : S extends ObjectSchema<infer _>
    ? InferObject<S>
    : S extends VariantSchema<infer V>
    ? V
    : S extends SpecialSchema<infer T>
    ? T
    : S extends OptionalSchema<infer _>
    ? Infer<S["entry"]>
    : never;

type InferObject<S extends ObjectSchema<ObjectEntries>> = Simplify<
    InferRequired<S["entries"]> & InferOptional<S["entries"]>
>;

type InferOptional<E extends ObjectEntries> = Partial<{
    [key in keyof ConditionalPick<E, OptionalSchema<AnySchema>>]: Infer<E[key]>;
}>;

type InferRequired<E extends ObjectEntries> = {
    [key in keyof ConditionalExcept<E, OptionalSchema<AnySchema>>]: Infer<
        E[key]
    >;
};

export type ValidationError = {
    [key: string]: ValidationError | string | undefined;
};

export function validate<S extends AnySchema, V extends Infer<S>>(
    schema: AnySchema,
    value: V,
): ValidationError {
    const error: ValidationError = {};
    if (schema.type === "object") {
        const objectSchema = schema as ObjectSchema<ObjectEntries>;
        const objectValue = value as Infer<typeof schema>;
        for (const [key, entrySchema] of Object.entries(objectSchema.entries)) {
            if (Object.hasOwn(objectValue, key)) {
                error[key] = validate(entrySchema, objectValue[key]);
            }
        }
    }
    return error;
}
