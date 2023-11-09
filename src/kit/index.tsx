import { Component, For, ParentComponent } from "solid-js";
import { AnyObjectSchema } from "~/lib/schema";
import { cls } from "~/lib/util";
import { Associative, AssociativeDemo, AssociativeProps } from "./associative";
import { Box, BoxDemo, BoxProps } from "./box";
import { Checkbox, CheckboxDemo, CheckboxProps } from "./checkbox";
import { Deck } from "./deck";
import { Demo } from "./demo";
import { Link, Routable, useHistory } from "./history";
import { TextInput, TextInputDemo, TextInputProps } from "./text-input";

// Kit is only included in dev mode, So load up the tailwind css via cdn
// to make tailwind classes available on the client.
if (!document.querySelector("#tailwind-cdn")) {
    const script = document.createElement("script");
    script.id = "tailwind-cdn";
    script.src = "https://cdn.tailwindcss.com";
    script.addEventListener("load", () => {
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
    component: Component | ParentComponent;
    schema: AnyObjectSchema;
    defaults?: Record<string, unknown>;
};

const Kit: Component = () => {
    const history = useHistory();
    const items: KitItem[] = [
        {
            label: "Associative",
            route: "/kit/associative",
            component: Associative,
            schema: AssociativeProps,
            defaults: AssociativeDemo,
        },
        {
            label: "Box",
            route: "/kit/box",
            component: Box,
            schema: BoxProps,
            defaults: BoxDemo,
        },
        {
            label: "Checkbox",
            route: "/kit/checkbox",
            component: Checkbox,
            schema: CheckboxProps,
            defaults: CheckboxDemo,
        },
        {
            label: "TextInput",
            route: "/kit/text-input",
            component: TextInput,
            schema: TextInputProps,
            defaults: TextInputDemo,
        },
    ];

    return (
        <div class="bg-neutral-emphasis border-t border-t-neutral-subtle flex flex-grow">
            <div class="text-white text-xl py-8 px-2 h-full flex flex-col gap-2">
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
                        view: () => (
                            <Demo
                                component={item.component}
                                schema={item.schema}
                                defaults={item.defaults}
                            />
                        ),
                    }))}
                />
            </div>
        </div>
    );
};

export default Kit;
