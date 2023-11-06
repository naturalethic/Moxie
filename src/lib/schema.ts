type Types = "object" | "string" | "boolean";

type Entries = Record<string, Schema<Types>>;

type Schema<T extends Types> = {
    type: T;
};

export type AnySchema = Schema<Types>;

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

type Object<E extends Entries> = Schema<"object"> & {
    entries: E;
};

export function object<E extends Entries>(entries: E): Object<E> {
    return {
        type: "object",
        entries,
    };
}

export type Infer<S extends AnySchema> = S["type"] extends "string"
    ? string
    : S["type"] extends "boolean"
    ? boolean
    : S extends Object<infer _>
    ? {
          [key in keyof S["entries"]]: Infer<S["entries"][key]>;
      }
    : null;
