import {
    Component,
    For,
    createEffect,
    createRenderEffect,
    createSignal,
    splitProps,
} from "solid-js";
import {
    Infer,
    array,
    boolean,
    object,
    optional,
    record,
    special,
    string,
    union,
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
    items: union(
        array(unknown()),
        record(unknown()),
        record(string()), // provides a type the lab understands
    ),
    value: optional(unknown()),
    allowNone: optional(boolean()),
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
        "value",
        "allowNone",
        "error",
        "small",
        "tip",
        "onChange",
    ]);
    const form = useForm();

    const [items, setItems] = createSignal<Record<string, unknown>>({});

    createRenderEffect(() => {
        if (Array.isArray(props.items)) {
            const items: Record<string, unknown> = {};
            for (const item of props.items as unknown[]) {
                items[(item as object).toString()] = item;
            }
            setItems(items);
        } else {
            setItems(props.items as Record<string, unknown>);
        }
    });

    const [value, setValue] = createSignal<unknown>();

    createEffect(() => {
        setValue(
            (form && props.name
                ? getPath(form.value, props.name)
                : undefined) ||
                (props.value ??
                    (!props.allowNone && Object.values(items())[0])) ||
                undefined,
        );
    });

    function handleChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        const value = items()[select.selectedOptions[0].label];
        setValue(value);
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
                <For each={Object.keys(items())}>
                    {(key) => (
                        <option value={key} selected={items()[key] === value()}>
                            {key}
                        </option>
                    )}
                </For>
            </select>
        </Label>
    );
};
