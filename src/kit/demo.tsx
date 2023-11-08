import { trackStore } from "@solid-primitives/deep";
import prettierHtml from "prettier/plugins/html";
import prettier from "prettier/standalone";
import {
    Component,
    For,
    ParentComponent,
    createEffect,
    createSignal,
} from "solid-js";
import {
    AnyObjectSchema,
    Infer,
    NonOptionalSchema,
    OptionalSchema,
    VariantSchema,
    string,
} from "~/lib/schema";
import { Checkbox } from "./checkbox";
import { Divider } from "./divider";
import { createForm } from "./form";
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
    defaults?: Record<string, unknown>;
};

async function format(html: string) {
    return await prettier.format(html, {
        parser: "html",
        plugins: [prettierHtml],
        tabWidth: 2,
        printWidth: 20,
        htmlWhitespaceSensitivity: "ignore",
    });
}

export const Demo = <
    S extends AnyObjectSchema,
    P extends Infer<S>,
    C extends Component<P> | ParentComponent<P>,
>(
    props: DemoProps<S, P, C>,
) => {
    if (props.defaults?.children) {
        props.schema.entries.children = string();
    }

    const form = createForm({
        schema: props.schema,
        prototype: (props.defaults ?? {}) as P,
    });

    const [code, setCode] = createSignal("");

    createEffect(async () => {
        const name = props.component.name.replace(/\[solid-refresh\]/g, "");
        const code = [];
        code.push(`<${name}`);
        for (const key of Object.keys(props.schema.entries)) {
            if (key in form.value && key !== "children") {
                let schema = props.schema.entries[key];
                if (schema.type === "optional") {
                    const optional =
                        schema as OptionalSchema<NonOptionalSchema>;
                    schema = optional.entry;
                }
                if (schema.type === "boolean") {
                    if (form.value[key]) {
                        code.push(` ${key}`);
                    }
                }
                if (
                    (schema.type === "string" || schema.type === "variant") &&
                    form.value[key]
                ) {
                    code.push(` ${key}="${form.value[key]}"`);
                }
            }
        }
        if (form.value.children) {
            if (code.length > 1) {
                code.push(">");
            } else {
                code[0] += ">";
            }
            code.push(`  ${form.value.children}`);
            code.push(`</${name}>`);
        } else {
            code.push("/>");
        }
        setCode(await format(code.join("")));
    });

    let componentDiv: HTMLDivElement;

    const [markup, setMarkup] = createSignal("");

    createEffect(async () => {
        trackStore(form.value);
        setMarkup(await format(componentDiv.innerHTML));
    });

    return (
        <div class="flex h-full">
            <div class="w-64 m-8 space-y-1">
                <form.Form>
                    <TextInput label="content" name="children" value="Demo" />
                    <For each={Object.keys(props.schema.entries)}>
                        {(key) => {
                            if (key === "children") {
                                return <></>;
                            }
                            let schema = props.schema.entries[key];
                            // XXX: How do we get discriminated union when switching on schema type?
                            if (schema.type === "optional") {
                                const optional =
                                    schema as OptionalSchema<NonOptionalSchema>;
                                schema = optional.entry;
                            }
                            if (schema.type === "string") {
                                return <TextInput label={key} name={key} />;
                            }
                            if (schema.type === "boolean") {
                                return <Checkbox label={key} name={key} />;
                            }
                            if (schema.type === "variant") {
                                const variant = schema as VariantSchema<string>;
                                return (
                                    <div>
                                        <Label label={key} />
                                        <Segmented
                                            name={key}
                                            allowNone
                                            options={Object.keys(
                                                variant.variant,
                                            )}
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
                </form.Form>
                <div class="pt-3 text-gray-600 space-y-5">
                    <Divider />
                    <pre class="text-xs p-3 border rounded bg-gray-600 text-gray-100">
                        {code()}
                    </pre>
                </div>
            </div>
            <div class="flex-grow m-8">
                <div>
                    <div
                        ref={componentDiv!}
                        class={
                            (props.defaults?.demoContainerClass as string) ?? ""
                        }
                    >
                        <props.component {...form.value} />
                    </div>
                </div>
                <div class="pt-3 space-y-5 relative">
                    <Divider />
                    <div class="w-full absolute overflow-auto rounded bg-gray-600 text-gray-100 p-3">
                        <pre class="text-xs">{markup()}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
};
