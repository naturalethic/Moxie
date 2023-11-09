import { Component, For, splitProps } from "solid-js";
import {
    Infer,
    boolean,
    object,
    optional,
    record,
    special,
    string,
    unknown,
} from "~/lib/schema";
import { cls, getPath, setPath } from "~/lib/util";
import { useForm } from "../lib/form";
import { Label } from "./label";

export const SelectLab: SelectProps = {
    items: {
        Screwtape: "screwtape",
        Wormwood: "wormwood",
        Toadpipe: "toadpipe",
    },
};

export const SelectProps = object({
    name: optional(string()),
    label: optional(string()),
    items: record(unknown()),
    error: optional(string()),
    small: optional(boolean()),
    tip: optional(string()),
    onChange: optional(special<(value: unknown) => void>()),
});

type SelectProps = Infer<typeof SelectProps>;

export const Select: Component<SelectProps> = (props) => {
    const [, selectProps] = splitProps(props, [
        "label",
        "items",
        "error",
        "small",
        "tip",
        "onChange",
    ]);
    const form = useForm();

    function handleChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        const value = props.items[select.selectedOptions[0].label];
        if (props.name && form) {
            setPath(form.value, props.name, value);
        }
        props.onChange?.(value);
    }

    return (
        <Label label={props.label} error={props.error} tip={props.tip}>
            <select
                {...selectProps}
                onChange={handleChange}
                class={cls({
                    "text-xs": props.small,
                    "text-sm": !props.small,
                })}
            >
                <For each={Object.keys(props.items)}>
                    {(key) => (
                        <option
                            value={key}
                            selected={
                                props.items[key] ===
                                (form &&
                                    props.name &&
                                    getPath(form.value, props.name))
                            }
                        >
                            {key}
                        </option>
                    )}
                </For>
            </select>
        </Label>
    );
};
