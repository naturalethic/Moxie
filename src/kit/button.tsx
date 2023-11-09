import { Component, ParentProps, Show } from "solid-js";
import {
    Infer,
    boolean,
    object,
    optional,
    special,
    string,
} from "~/lib/schema";
import { cls } from "~/lib/util";
import { Icon } from "./icon";

export const ButtonLab: ButtonProps = {
    children: "Button",
};

export const ButtonProps = object({
    leadingIcon: optional(string()),
    small: optional(boolean()),
    stretch: optional(boolean()),
    onClick: optional(special<() => void>()),
    submit: optional(boolean()),
    class: optional(string()),
});

type ButtonProps = Infer<typeof ButtonProps> & ParentProps;

export const Button: Component<ButtonProps> = (props) => {
    const size = props.small ? "small" : "normal";
    const submit = props.submit ?? true;
    return (
        <div
            class={cls(props.class, "button-container", {
                "text-xs": size === "small",
                "text-sm": size === "normal",
            })}
        >
            <button
                class={cls("button", { "w-full": props.stretch })}
                type={submit ? "submit" : "button"}
                onClick={props.onClick}
            >
                {props.children}
            </button>
            <Show when={props.leadingIcon}>
                <Icon
                    name={props.leadingIcon!}
                    class={`button-icon button-leading-icon button-leading-icon-${size}`}
                />
            </Show>
        </div>
    );
};
