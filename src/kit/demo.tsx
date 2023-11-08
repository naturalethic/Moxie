import { Component, For, ParentComponent } from "solid-js";
import { createMutable } from "solid-js/store";
import {
    AnyObjectSchema,
    Infer,
    NonOptionalSchema,
    OptionalSchema,
    VariantSchema,
} from "~/lib/schema";
import { Checkbox } from "./checkbox";
import { Divider } from "./divider";
import { TextInput } from "./input";
import { Label } from "./label";
import { Segmented } from "./segmented";

type DemoProps<
    S extends AnyObjectSchema,
    P extends Infer<S>,
    C extends Component<P> | ParentComponent<P>,
> = {
    schema: S;
    component: C;
};

export const Demo = <
    S extends AnyObjectSchema,
    P extends Infer<S>,
    C extends Component<P> | ParentComponent<P>,
>(
    props: DemoProps<S, P, C>,
) => {
    const componentProps = createMutable({
        children: "Demo",
    }) as P;

    function update(key: string, reset?: string) {
        return function (value: unknown) {
            if (value === reset) {
                // @ts-ignore
                delete componentProps[key];
            } else {
                // @ts-ignore
                componentProps[key] = value;
            }
        };
    }

    function code() {
        const name = props.component.name.replace(/\[solid-refresh\]/g, "");
        const lines = [];
        lines.push(`<${name}`);
        for (const key of Object.keys(props.schema.entries)) {
            if (!(key in componentProps)) {
                continue;
            }
            let schema = props.schema.entries[key];
            if (schema.type === "optional") {
                const optional = schema as OptionalSchema<NonOptionalSchema>;
                schema = optional.entry;
            }
            if (schema.type === "boolean") {
                if (componentProps[key]) {
                    lines.push(`    ${key}`);
                }
            }
            if (schema.type === "string" || schema.type === "variant") {
                lines.push(`    ${key}="${componentProps[key]}"`);
            }
        }
        // for (const [key, value] of Object.entries(componentProps)) {
        //     if (key === "children") {
        //         continue;
        //     }
        //     lines.push(`    ${key}="${value}"`);
        // }
        if (lines.length > 1) {
            lines.push(">");
        } else {
            lines[0] += ">";
        }
        lines.push(`    ${componentProps.children}`);
        lines.push(`</${name}>`);
        return lines.join("\n");
    }

    return (
        <div class="flex h-full">
            <div class="w-64 m-8 space-y-1">
                <TextInput
                    label="content"
                    onChange={update("children")}
                    value="Demo"
                />
                <For each={Object.keys(props.schema.entries)}>
                    {(key) => {
                        let schema = props.schema.entries[key];
                        // XXX: How do we get discriminated union when switching on schema type?
                        if (schema.type === "optional") {
                            const optional =
                                schema as OptionalSchema<NonOptionalSchema>;
                            schema = optional.entry;
                        }
                        if (schema.type === "string") {
                            return (
                                <TextInput label={key} onChange={update(key)} />
                            );
                        }
                        if (schema.type === "boolean") {
                            return (
                                <Checkbox label={key} onChange={update(key)} />
                            );
                        }
                        if (schema.type === "variant") {
                            const variant = schema as VariantSchema<string>;
                            return (
                                <div>
                                    <Label label={key} />
                                    <Segmented
                                        name={key}
                                        options={["X"].concat(
                                            Object.keys(variant.variant),
                                        )}
                                        onChange={update(key, "X")}
                                    />{" "}
                                </div>
                            );
                        }
                        if (schema.type === "special") {
                            return <></>;
                        }
                        return (
                            <div>
                                Unhandled: {key}: {schema.type}
                            </div>
                        );
                    }}
                </For>
                <div class="pt-3 text-gray-600">
                    <Divider />
                    <pre class="text-sm pt-3">{code()}</pre>
                </div>
            </div>
            <div class="flex-grow m-8">
                <props.component {...componentProps} />
            </div>
        </div>
    );
};
