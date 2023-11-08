import { Component, JSX } from "solid-js";
import { Deck } from "./deck";
import { Demo } from "./demo";
// import { Divider, DividerProps } from "./divider";
import { Box, BoxProps } from "./box";
import { Link, Routable } from "./history";

type KitItem = Routable & {
    label: string;
    view: () => JSX.Element;
};

export const Kit: Component = () => {
    const items: KitItem[] = [
        {
            label: "Box",
            route: "/kit/box",
            view: () => <Demo component={Box} schema={BoxProps} />,
        },
        // {
        //     label: "Divider",
        //     route: "/kit/divider",
        //     view: () => <Demo component={Divider} schema={DividerProps} />,
        // },
    ];

    return (
        <div class="bg-neutral-emphasis border-t border-t-neutral-subtle flex flex-grow">
            <div class="text-white text-xl p-8 h-full">
                <Link route="/kit/box">Box</Link>
            </div>
            <div class="m-2 bg-neutral-100 flex-grow rounded">
                <Deck items={items} />
            </div>
        </div>
    );
};
