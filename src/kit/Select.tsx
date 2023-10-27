import { Component, For, createEffect, splitProps, useContext } from "solid-js";
import { cls, getPath, setPath } from "~/lib/util";
import { FormContext } from "./Form";
import { Label } from "./Label";
import { Option, optionLabel, optionValue } from "./Option";

export const Select: Component<{
    name?: string;
    label?: string;
    options?: Option[];
    error?: string;
    value?: string;
    size?: "small" | "normal";
    onChange?: (value: string) => void;
}> = (props) => {
    const [, selectProps] = splitProps(props, [
        "label",
        "error",
        "value",
        "size",
    ]);
    const form = useContext(FormContext);

    function handleChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        if (props.name && form) {
            setPath(form.value, props.name, select.value);
        }
        props.onChange?.(select.value);
    }

    createEffect(() => {
        // Initialize the form data value for this select to the first item, if it is not yet defined.
        if (
            form &&
            props.name &&
            props.options &&
            props.options.length > 0 &&
            !getPath(form.value, props.name)
        ) {
            setPath(form.value, props.name, optionValue(props.options[0]));
        }
    });

    return (
        <Label label={props.label} error={props.error}>
            <select
                {...selectProps}
                onChange={handleChange}
                class={cls({
                    "text-sm": !props.size || props.size === "normal",
                    "text-xs": props.size === "small",
                })}
            >
                <For each={props.options}>
                    {(option) => (
                        <option
                            value={optionValue(option)}
                            selected={
                                optionValue(option) ===
                                (props.value ??
                                    (props.name &&
                                        form &&
                                        getPath(form.value, props.name)))
                            }
                        >
                            {optionLabel(option)}
                        </option>
                    )}
                </For>
            </select>
        </Label>
    );
};
