import { ConditionalExcept, ConditionalPick, Simplify } from "type-fest";

// biome-ignore lint/suspicious/noExplicitAny: XXX: Type this properly later
type Validations = ((value: any) => string | undefined)[];

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

export class NumberSchema extends Schema {
    public readonly type = "number" as "number" & {
        readonly brand: unique symbol;
    };
}

export function number(validations: Validations = []) {
    return new NumberSchema(validations);
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

export class ArraySchema<T extends AnySchema> extends Schema {
    public readonly type = "array" as "array" & {
        readonly brand: unique symbol;
    };
    constructor(public entry: T) {
        super([]);
    }
}

export function array<T extends AnySchema>(entry: T) {
    return new ArraySchema(entry);
}

export class RecordSchema<T extends AnySchema> extends Schema {
    public readonly type = "record" as "record" & {
        readonly brand: unique symbol;
    };
    constructor(public entry: T) {
        super([]);
    }
}

export function record<T extends AnySchema>(entry: T) {
    return new RecordSchema(entry);
}

export class LiteralSchema<T extends string> extends Schema {
    public readonly type = "literal" as "literal" & {
        readonly brand: unique symbol;
    };
    constructor(public value: T) {
        super([]);
    }
}

export function literal<T extends string>(value: T) {
    return new LiteralSchema(value);
}

export class DiscriminatedSchema<
    T extends string,
    V extends ObjectSchema<Record<T, LiteralSchema<string>> & ObjectEntries>,
> extends Schema {
    public readonly type = "discriminate" as "discriminate" & {
        readonly brand: unique symbol;
    };
    constructor(public discriminant: T, public variants: V[]) {
        super([]);
    }
}

export function discriminated<
    T extends string,
    V extends ObjectSchema<Record<T, LiteralSchema<string>> & ObjectEntries>,
>(discriminant: T, variants: V[]) {
    return new DiscriminatedSchema(discriminant, variants);
}

export type NonOptionalSchema =
    | { type: BooleanSchema["type"] }
    | { type: StringSchema["type"] }
    | { type: NumberSchema["type"] }
    | { type: ObjectSchema<ObjectEntries>["type"] }
    | { type: VariantSchema<string>["type"] }
    | { type: SpecialSchema<string>["type"] }
    | { type: ArraySchema<AnySchema>["type"] }
    | { type: RecordSchema<AnySchema>["type"] }
    | { type: LiteralSchema<"z">["type"] }
    | {
          type: DiscriminatedSchema<
              "z",
              ObjectSchema<Record<"z", LiteralSchema<"z">>>
          >["type"];
      };

export type AnySchema =
    | NonOptionalSchema
    | { type: OptionalSchema<StringSchema>["type"] };

export class OptionalSchema<T extends NonOptionalSchema> extends Schema {
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
    : S extends BooleanSchema
    ? boolean
    : S extends StringSchema
    ? string
    : S extends NumberSchema
    ? number
    : S extends VariantSchema<infer T>
    ? T
    : S extends SpecialSchema<infer T>
    ? T
    : S extends OptionalSchema<infer T>
    ? Infer<T>
    : S extends ArraySchema<infer T>
    ? Infer<T>[]
    : S extends RecordSchema<infer T>
    ? Record<string, Infer<T>>
    : S extends LiteralSchema<infer T>
    ? T
    : S extends DiscriminatedSchema<infer _T, infer _V>
    ? Infer<S["variants"][number]>
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
