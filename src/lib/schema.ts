type SchemaType = "object" | "string" | "boolean";

export type Schema<T extends SchemaType> = {
    type: T;
};

export type AnySchema = Schema<SchemaType>;

export function string(): Schema<"string"> {
    return {
        type: "string",
    };
}

export function boolean(): Schema<"boolean"> {
    return {
        type: "boolean",
    };
}

type ObjectEntries = Record<string, Schema<SchemaType>>;

export type ObjectSchema<E extends ObjectEntries> = Schema<"object"> & {
    entries: E;
};

export function object<E extends ObjectEntries>(entries: E): ObjectSchema<E> {
    return {
        type: "object",
        entries,
    };
}

export type Infer<S extends AnySchema> = S["type"] extends "string"
    ? string
    : S["type"] extends "boolean"
    ? boolean
    : S extends ObjectSchema<infer _>
    ? {
          [key in keyof S["entries"]]: Infer<S["entries"][key]>;
      }
    : never;
