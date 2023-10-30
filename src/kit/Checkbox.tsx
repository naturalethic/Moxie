import { Component, Show, splitProps, useContext } from "solid-js";
import { getPath, setPath } from "~/lib/util";
import { FormContext } from "./Form";

export const Checkbox: Component<{
    name?: string;
    label: string;
    tip?: string;
    error?: string;
}> = (props) => {
    const [, inputProps] = splitProps(props, ["label", "error", "tip"]);

    const form = useContext(FormContext);

    return (
        <label class="flex gap-[5px] tooltip-host select-none">
            <input
                type="checkbox"
                {...inputProps}
                checked={
                    props.name && form
                        ? (getPath(form.value, props.name) as boolean)
                        : false
                }
                onChange={(event) => {
                    const input = event.target as HTMLInputElement;
                    if (props.name && form) {
                        setPath(form.value, props.name, input.checked);
                    }
                }}
            />
            <div
                class="flex items-baseline justify-between"
                data-tip={props.tip}
            >
                <div class="flex gap-1">
                    <div class="text-sm">{props.label}</div>
                    <Show when={props.tip}>
                        <div class="tooltip" data-tip={props.tip}>
                            ?
                        </div>
                    </Show>
                </div>
                <Show when={props.error}>
                    <div class="danger text-xs">{props.error}</div>
                </Show>
            </div>
        </label>
    );
};
