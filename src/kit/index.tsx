import { Component, For, ParentComponent } from "solid-js";
import { AnyObjectSchema } from "~/lib/schema";
import { cls } from "~/lib/util";
import { Box, BoxDemo, BoxProps } from "./box";
import { Checkbox, CheckboxDemo, CheckboxProps } from "./checkbox";
import { Deck } from "./deck";
import { Demo } from "./demo";
import { Link, Routable, useHistory } from "./history";

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
