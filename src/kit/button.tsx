import { ParentComponent, Show } from "solid-js";
import { cls } from "~/lib/util";
import { Icon } from "./icon";

export const Button: ParentComponent<{
    leadingIcon?: string;
    small?: boolean;
    stretch?: boolean;
    onClick?: () => void;
    submit?: boolean;
    class?: string;
}> = (props) => {
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
