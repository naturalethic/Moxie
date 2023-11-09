import { Component, Show, splitProps } from "solid-js";
import { Infer, object, optional, special, string } from "~/lib/schema";
import { getPath, setPath } from "~/lib/util";
import { useForm } from "../lib/form";

export const CheckboxDemo = {
    label: "Checkbox",
};

export const CheckboxProps = object({
    name: optional(string()),
    label: optional(string()),
    tip: optional(string()),
    error: optional(string()),
    onChange: optional(special<(checked: boolean) => void>()),
});

type CheckboxProps = Infer<typeof CheckboxProps>;

export const Checkbox: Component<CheckboxProps> = (props) => {
    const [, inputProps] = splitProps(props, [
        "label",
        "error",
        "tip",
        "onChange",
    ]);

    const form = useForm();

    return (
        <label class="flex tooltip-host select-none gap-[5px]">
            <input
                class="w-fit"
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
                    props.onChange?.(input.checked);
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
