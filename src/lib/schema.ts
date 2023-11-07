import { ConditionalExcept, ConditionalPick, Simplify } from "type-fest";

type Validations = ((value: unknown) => string | undefined)[];

export class Schema {
    public readonly schema = true as true & { readonly brand: unique symbol };
    constructor(public readonly validations: Validations) {}
}

export class BooleanSchema extends Schema {
    public readonly type = "boolean" as "boolean" & {
        readonly brand: unique symbol;
    };
}

export function boolean(validations: Validations = []) {
    return new BooleanSchema(validations);
}

export class StringSchema extends Schema {
    public readonly type = "string" as "string" & {
        readonly brand: unique symbol;
    };
}

export function string(validations: Validations = []) {
    return new StringSchema(validations);
}

export type ObjectEntries = Record<string, AnySchema>;

export class ObjectSchema<T extends ObjectEntries> extends Schema {
    public readonly type = "object" as "object" & {
        readonly brand: unique symbol;
    };
    constructor(public entries: T) {
        super([]);
    }
}

export type AnyObjectSchema = ObjectSchema<ObjectEntries>;

export function object<T extends ObjectEntries>(entries: T) {
    return new ObjectSchema(entries);
}

export class VariantSchema<T extends string> extends Schema {
    public readonly type = "variant" as "variant" & {
        readonly brand: unique symbol;
    };
    constructor(public variant: Record<T, T>) {
        super([]);
    }
}

export function variant<T extends string>(...items: T[]) {
    const map: { [key: string]: string } = {};
    for (const item of items) {
        map[item] = item;
    }
    return new VariantSchema(Object.freeze(map) as Record<T, T>);
}

export class SpecialSchema<T> extends Schema {
    public readonly type = "special" as "special" & {
        readonly brand: unique symbol;
    };
    constructor(public marker: T) {
        super([]);
    }
}

export function special<T>() {
    return new SpecialSchema({} as T);
}

type NonOptionalSchema =
    | { type: BooleanSchema["type"] }
    | { type: StringSchema["type"] }
    | { type: ObjectSchema<ObjectEntries>["type"] }
    | { type: VariantSchema<string>["type"] }
    | { type: SpecialSchema<string>["type"] };

export type AnySchema =
    | NonOptionalSchema
    | { type: OptionalSchema<StringSchema>["type"] };

class OptionalSchema<T extends NonOptionalSchema> extends Schema {
    public readonly type = "optional" as "optional" & {
        readonly brand: unique symbol;
    };
    constructor(public entry: T) {
        super([]);
    }
}

export function optional<T extends NonOptionalSchema>(entry: T) {
    return new OptionalSchema(entry);
}

export type Infer<S extends AnySchema> = S extends ObjectSchema<infer T>
    ? InferEntries<T>
    : S extends StringSchema
    ? string
    : S extends BooleanSchema
    ? boolean
    : S extends VariantSchema<infer T>
    ? T
    : S extends SpecialSchema<infer T>
    ? T
    : S extends OptionalSchema<infer T>
    ? Infer<T>
    : never;

type InferEntries<T extends ObjectEntries> = Simplify<
    InferOptionalEntries<T> & InferRequiredEntries<T>
>;

type InferOptionalEntries<T extends ObjectEntries> = Partial<{
    [key in keyof ConditionalPick<T, { type: "optional" }>]: Infer<T[key]>;
}>;

type InferRequiredEntries<T extends ObjectEntries> = {
    [key in keyof ConditionalExcept<T, { type: "optional" }>]: Infer<T[key]>;
};
