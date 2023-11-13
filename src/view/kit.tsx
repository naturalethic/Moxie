import { trackStore } from "@solid-primitives/deep";
import components from "kit:components";
import prettierEstree from "prettier/plugins/estree";
import prettierHtml from "prettier/plugins/html";
import prettierTypescript from "prettier/plugins/typescript";
import prettier from "prettier/standalone";
import { capitalize, pascal, title } from "radash";
import {
    Component,
    For,
    JSX,
    ParentComponent,
    Show,
    createEffect,
    createSignal,
    lazy,
} from "solid-js";
import { TextArea } from "~/kit/text-area";
import {
    AnyObject,
    AnyObjectSchema,
    AnySchema,
    Infer,
    NonOptionalSchema,
    OptionalSchema,
    VariantSchema,
    string,
} from "~/lib/schema";
import { cls } from "~/lib/util";
import { Associative } from "../kit/associative";
import { Box } from "../kit/box";
import { Checkbox } from "../kit/checkbox";
import { Deck } from "../kit/deck";
import { Label } from "../kit/label";
import { List } from "../kit/list";
import { Segmented } from "../kit/segmented";
import { TextInput } from "../kit/text-input";
import { createForm } from "../lib/form";
import { Link, Routable, useHistory } from "../lib/history";

// Kit is only included in dev mode, So load up the tailwind css via cdn
// to make tailwind classes available on the client.
if (!document.querySelector("#tailwind-cdn")) {
    // Temporarily replace console.warn to redact the tailwind cdn message.
    const warn = console.warn;
    console.warn = (...args: string[]) => {
        if (!args[0].startsWith("cdn.tailwindcss.com")) {
            warn(...args);
        }
    };
    const script = document.createElement("script");
    script.id = "tailwind-cdn";
    script.src = "https://cdn.tailwindcss.com";
    script.addEventListener("load", () => {
        console.warn = warn;
        // Disable tailwind reset so it doesn't clobber our existing styles.
        // @ts-ignore
        tailwind.config = {
            corePlugins: {
                preflight: false,
            },
        };
    });
    document.head.appendChild(script);
}

type KitItem = Routable & {
    label: string;
    view: () => JSX.Element;
};

function item(name: string): KitItem {
    const cname = pascal(name);
    return {
        label: cname,
        route: `/kit/${name}`,
        view: lazy(async () => {
            // const module = await import(/* @vite-ignore */ `./${name}`);
            const module = await import(`../kit/${name}.tsx`);
            const component = module[cname] as Component;
            const schema = module[`${cname}Props`] as AnyObjectSchema;
            const defaults = module[`${cname}Lab`] ?? {};
            return {
                default: () => (
                    <Lab
                        component={component}
                        schema={schema}
                        defaults={defaults}
                    />
                ),
            };
        }),
    };
}

export const Kit: Component = () => {
    const history = useHistory();
    const items: KitItem[] = components.map(item);

    return (
        <div class="bg-neutral-emphasis border-t border-t-neutral-subtle flex flex-grow">
            <div class="text-white text-lg py-8 px-2 h-full flex flex-col gap-2">
                <For each={items}>
                    {(item) => (
                        <Link
                            class={cls("px-6 py-1 rounded", {
                                "bg-slate-700": item.route === history.route(),
                            })}
                            route={item.route}
                        >
                            {item.label}
                        </Link>
                    )}
                </For>
            </div>
            <div class="m-2 bg-neutral-100 flex-grow rounded">
                <Deck
                    items={items.map((item) => ({
                        route: item.route,
                        view: item.view,
                    }))}
                />
            </div>
        </div>
    );
};

type LabProps<
    S extends AnyObjectSchema,
    P extends Infer<S>,
    C extends Component<P> | ParentComponent<P>,
> = {
    schema: S;
    component: C;
    defaults: Record<string, unknown>;
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

const Lab = <
    S extends AnyObjectSchema,
    P extends Infer<S>,
    C extends Component<P> | ParentComponent<P>,
>(
    props: LabProps<S, P, C>,
) => {
    if (props.defaults.children) {
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
                console.log(schema.type);
                code.push(attributeForSchema(schema, key, form.value));
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
                    <Show when={props.defaults.children}>
                        <TextArea
                            lines={3}
                            resizable
                            label="content"
                            name="children"
                            value={(props.defaults.children as string) ?? ""}
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
                            return fieldForSchema(schema, key, form.value);
                        }}
                    </For>
                </form.Form>
            </Box>
            <div class="border border-border bg-white rounded bg-gray-white p-4">
                <div
                    ref={componentDiv!}
                    class={cls(props.defaults.labContainerClass)}
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

function attributeForSchema(
    schema: AnySchema,
    key: string,
    value: AnyObject,
): string {
    if (schema.type === "boolean") {
        if (value[key]) {
            return ` ${key}`;
        }
    }
    if ((schema.type === "string" || schema.type === "variant") && value[key]) {
        return ` ${key}="${value[key]}"`;
    }
    if (
        schema.type === "record" ||
        schema.type === "array" ||
        schema.type === "number"
    ) {
        if (value[key]) {
            return ` ${key}={${JSON.stringify(value[key])}}`;
        }
    }
    return "";
}

function fieldForSchema(schema: AnySchema, key: string, value: AnyObject) {
    const label = capitalize(title(key).toLowerCase());
    if (schema.type === "string") {
        return <TextInput label={label} name={key} small />;
    }
    if (schema.type === "number") {
        return <TextInput type="number" label={label} name={key} small />;
    }
    if (schema.type === "boolean") {
        return <Checkbox label={label} name={key} />;
    }
    if (schema.type === "variant") {
        const variant = schema as VariantSchema<string>;
        return (
            <div>
                <Label label={label} />
                <Segmented name={key} allowNone items={variant.variant} />{" "}
            </div>
        );
    }
    if (schema.type === "record") {
        return (
            <div>
                <Label label={label} />
                <Associative name={key} />
            </div>
        );
    }
    if (schema.type === "array") {
        return (
            <div>
                <Label label={label} />
                <List items={value[key]} />
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
}
