import { ParentComponent, Show } from "solid-js";
import {
    Input,
    boolean,
    enumType,
    object,
    optional,
    special,
    string,
} from "valibot";
import { cls } from "~/lib/util";
import { Icon } from "./icon";

export const BoxProps = object({
    class: optional(string()),
    contentClass: optional(string()),
    style: optional(string()),
    border: optional(boolean()),
    shaded: optional(boolean()),
    title: optional(string()),
    variant: optional(enumType(["danger", "attention", "success"])),
    onClick: special<() => void>(() => true),
});

// export type BoxProps = {
//     class?: string;
//     contentClass?: string;
//     style?: string;
//     border?: boolean;
//     shaded?: boolean;
//     title?: string;
//     variant?: "danger" | "attention" | "success";
//     onClick?: () => void;
// };

export type BoxProps = Input<typeof BoxProps>;

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
