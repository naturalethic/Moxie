import { trackStore } from "@solid-primitives/deep";
import { capitalize, titleize, underscore } from "inflection";
import prettierEstree from "prettier/plugins/estree";
import prettierHtml from "prettier/plugins/html";
import prettierTypescript from "prettier/plugins/typescript";
import prettier from "prettier/standalone";
import {
    Component,
    For,
    ParentComponent,
    Show,
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
import { Associative } from "./associative";
import { Box } from "./box";
import { Checkbox } from "./checkbox";
import { createForm } from "./form";
import { Label } from "./label";
import { Segmented } from "./segmented";
import { TextInput } from "./text-input";

type DemoProps<
    S extends AnyObjectSchema,
    P extends Infer<S>,
    C extends Component<P> | ParentComponent<P>,
> = {
    schema: S;
    component: C;
    defaults?: Record<string, unknown>;
};

async function format(
    parser: "html" | "typescript",
    printWidth: number,
    source: string,
) {
    const formatted = await prettier.format(source, {
        parser,
        plugins: [prettierHtml, prettierTypescript, prettierEstree],
        tabWidth: 2,
        printWidth,
        htmlWhitespaceSensitivity: "ignore",
    });
    return formatted.replace(/;\s*$/, "");
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
                if (schema.type === "record") {
                    if (form.value[key]) {
                        code.push(
                            ` ${key}={${JSON.stringify(form.value[key])}}`,
                        );
                    }
                }
            }
        }
        if (form.value.children) {
            if (code.length > 1) {
                code.push(">");
            } else {
                code[0] += ">";
            }
            code.push(`${form.value.children}`);
            code.push(`</${name}>`);
        } else {
            code.push("/>");
        }
        setCode(await format("typescript", 40, code.join("")));
    });

    let componentDiv: HTMLDivElement;

    const [markup, setMarkup] = createSignal("");

    createEffect(async () => {
        trackStore(form.value);
        setMarkup(await format("html", 80, componentDiv.innerHTML));
    });

    return (
        <div class="grid grid-cols-[300px_auto] grid-rows-[auto_1fr] p-4 gap-4 h-full">
            <Box shaded border class="p-2">
                <form.Form>
                    <Show when={props.defaults?.children}>
                        <TextInput
                            label="content"
                            name="children"
                            value="Demo"
                        />
                    </Show>
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
                                return (
                                    <TextInput
                                        label={capitalize(
                                            titleize(underscore(key)),
                                        )}
                                        name={key}
                                        small
                                    />
                                );
                            }
                            if (schema.type === "boolean") {
                                return (
                                    <Checkbox
                                        label={capitalize(
                                            titleize(underscore(key)),
                                        )}
                                        name={key}
                                    />
                                );
                            }
                            if (schema.type === "variant") {
                                const variant = schema as VariantSchema<string>;
                                return (
                                    <div>
                                        <Label
                                            label={capitalize(
                                                titleize(underscore(key)),
                                            )}
                                        />
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
                            if (schema.type === "record") {
                                return (
                                    <div>
                                        <Label
                                            label={capitalize(
                                                titleize(underscore(key)),
                                            )}
                                        />
                                        <Associative name={key} />
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
            </Box>
            <div class="border border-border bg-white rounded bg-gray-white p-4">
                <div
                    ref={componentDiv!}
                    class={(props.defaults?.demoContainerClass as string) ?? ""}
                >
                    <props.component {...form.value} />
                </div>
            </div>
            <div class="relative">
                <div class="w-full h-full absolute overflow-auto rounded bg-slate-600 text-slate-100 p-3 text-xs">
                    <pre>{code()}</pre>
                </div>
            </div>
            <div class="relative">
                <div class="w-full h-full absolute overflow-auto rounded text-slate-400 p-3 text-xs">
                    <pre>{markup()}</pre>
                </div>
            </div>
        </div>
    );
};
