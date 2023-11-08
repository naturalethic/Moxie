import { Component, For, ParentComponent } from "solid-js";
import { AnyObjectSchema } from "~/lib/schema";
import { Box, BoxDemo, BoxProps } from "./box";
import { Checkbox, CheckboxDemo, CheckboxProps } from "./checkbox";
import { Deck } from "./deck";
import { Demo } from "./demo";
import { Link, Routable } from "./history";

type KitItem = Routable & {
    label: string;
    component: Component | ParentComponent;
    schema: AnyObjectSchema;
    defaults?: Record<string, unknown>;
};

export const Kit: Component = () => {
    const items: KitItem[] = [
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
    ];

    return (
        <div class="bg-neutral-emphasis border-t border-t-neutral-subtle flex flex-grow">
            <div class="text-white text-xl p-8 h-full flex flex-col gap-2">
                <For each={items}>
                    {(item) => <Link route={item.route}>{item.label}</Link>}
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
