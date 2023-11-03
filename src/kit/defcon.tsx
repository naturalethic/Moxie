import { Component } from "solid-js";
import { cls } from "~/lib/util";

export const Defcon: Component<{ complexity: number }> = (props) => {
    return (
        <div class="defcon">
            <div class={cls("defcon-1", { active: props.complexity >= 1 })} />
            <div class={cls("defcon-2", { active: props.complexity >= 2 })} />
            <div class={cls("defcon-3", { active: props.complexity >= 3 })} />
            <div class={cls("defcon-4", { active: props.complexity >= 4 })} />
            <div class={cls("defcon-5", { active: props.complexity >= 5 })} />
        </div>
    );
};
