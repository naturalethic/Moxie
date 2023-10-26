import { Component, For, createEffect, splitProps, useContext } from "solid-js";
import { cls } from "~/lib/util";
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
}> = (props) => {
    const [, selectProps] = splitProps(props, [
        "label",
        "error",
        "value",
        "size",
    ]);
    const { form, setForm } = useContext(FormContext);

    function handleChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        if (props.name && setForm) {
            setForm(props.name.split("."), select.value);
        }
    }

    createEffect(() => {
        if (
            form &&
            props.name &&
            !form[props.name] &&
            setForm &&
            props.options &&
            props.options.length > 0
        ) {
            setForm(props.name.split("."), optionValue(props.options[0]));
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
                                        (form?.[props.name] as string)))
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
