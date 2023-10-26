import { Component, For, createEffect, splitProps, useContext } from "solid-js";
import { FormContext } from "./Form";
import { Label } from "./Label";
import { Option, optionLabel, optionValue } from "./Option";

export const Select: Component<{
    name: string;
    label: string;
    options?: Option[];
    error?: string;
    defaultValue?: string;
}> = (props) => {
    const [, selectProps] = splitProps(props, [
        "label",
        "error",
        "defaultValue",
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
            <select {...selectProps} onChange={handleChange}>
                <For each={props.options}>
                    {(option) => (
                        <option
                            value={optionValue(option)}
                            selected={
                                optionValue(option) ===
                                (props.defaultValue ??
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
