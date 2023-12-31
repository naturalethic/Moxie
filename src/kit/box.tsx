import { ParentComponent, Show } from "solid-js";
import {
    Infer,
    boolean,
    object,
    optional,
    special,
    string,
    variant,
} from "~/lib/schema";
import { cls } from "~/lib/util";
import { Icon } from "./icon";

export const BoxLab = {
    children:
        "I note what you say about guiding your patient's reading and taking care that he sees a good deal of his materialist friend. But are you not being a trifle naive? It sounds as if you suppose that argument was the way to keep him out of the enemy's clutches. That might have been so if he had lived a few centuries earlier.",
};

export const BoxProps = object({
    class: optional(string()),
    contentClass: optional(string()),
    style: optional(string()),
    border: optional(boolean()),
    shaded: optional(boolean()),
    title: optional(string()),
    variant: optional(variant("danger", "attention", "success")),
    onClick: optional(special<() => void>()),
});

export type BoxProps = Infer<typeof BoxProps>;

export const Box: ParentComponent<BoxProps> = (props) => {
    return (
        <div
            class={cls("box", props.class, {
                "box-border": props.border,
                "box-shaded": props.shaded,
                "box-variant": props.variant,
                [`box-${props.variant}`]: props.variant,
            })}
            style={props.style}
            onClick={props.onClick}
        >
            <Show when={props.variant === "danger"}>
                <div class="icon-container">
                    <Icon name="alert-triangle" />
                </div>
            </Show>
            <Show when={props.variant === "attention"}>
                <div class="icon-container">
                    <Icon name="info-square" />
                </div>
            </Show>
            <Show when={props.variant === "success"}>
                <div class="icon-container">
                    <Icon name="circle-check" />
                </div>
            </Show>
            <Show when={props.variant}>
                <div class="flex items-center" style="max-width: 280px;">
                    <div>{props.children}</div>
                </div>
            </Show>
            <Show when={!props.variant}>
                <Show when={props.title}>
                    <div class="box-title">{props.title}</div>
                </Show>
                <div
                    class={cls("w-full h-full", {
                        "box-titled-content": props.title,
                    })}
                >
                    <div class={props.contentClass}>{props.children}</div>
                </div>
            </Show>
        </div>
    );
};
