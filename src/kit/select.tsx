import { For, createEffect, splitProps, useContext } from "solid-js";
import { cls, getPath, setPath } from "~/lib/util";
import { FormContext } from "./form";
import { Label } from "./label";
import { Option, optionLabel, optionValue } from "./option";

type SelectProps<T extends string | number> = {
    name?: string;
    label?: string;
    options?: Option<T>[];
    error?: string;
    value?: T;
    size?: "small" | "normal";
    tip?: string;
    onChange?: (value: T) => void;
};

export const Select = <T extends string | number,>(props: SelectProps<T>) => {
    const [, selectProps] = splitProps(props, [
        "label",
        "error",
        "value",
        "size",
        "tip",
        "onChange",
    ]);
    const form = useContext(FormContext);

    function handleChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        const value = optionValue(props.options![select.selectedIndex]);
        if (props.name && form) {
            setPath(form.value, props.name, value);
        }
        props.onChange?.(value);
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
        <Label label={props.label} error={props.error} tip={props.tip}>
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
