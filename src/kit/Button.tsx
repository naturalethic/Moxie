import { ParentComponent, Show } from "solid-js";
import { Icon } from "./Icon";

export const Button: ParentComponent<{
    leadingIcon?: string;
    size?: "small" | "normal";
}> = (props) => {
    const size = props.size ?? "normal";
    return (
        <div class="button-container">
            <button>{props.children}</button>
            <Show when={props.leadingIcon}>
                <Icon
                    name={props.leadingIcon!}
                    class={`button-icon button-leading-icon button-leading-icon-${size}`}
                />
            </Show>
        </div>
    );
};
