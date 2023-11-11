import { Component, For, createEffect, createSignal } from "solid-js";
import {
    Infer,
    boolean,
    object,
    optional,
    record,
    special,
    string,
} from "~/lib/schema";
import { cls, getPath, setPath } from "~/lib/util";
import { useForm } from "../lib/form";

export const SegmentedLab: SegementedProps = {
    items: {
        Screwtape: "screwtape",
        Wormword: "wormword",
        Toadpipe: "toadpipe",
    },
    value: "screwtape",
};

export const SegmentedProps = object({
    name: optional(string()),
    value: optional(string()),
    items: record(string()),
    allowNone: optional(boolean()),
    onChange: optional(special<(value: string | undefined) => void>()),
});

type SegementedProps = Infer<typeof SegmentedProps>;

export const Segmented: Component<SegementedProps> = (props) => {
    const form = useForm();

    const [value, setValue] = createSignal<string | undefined>();

    createEffect(() => {
        setValue(
            (form && props.name
                ? getPath(form.value, props.name)
                : undefined) ||
                (props.value ??
                    (!props.allowNone && Object.values(props.items)[0])) ||
                undefined,
        );
    });

    function handleClick(itemValue: string) {
        let newValue: string | undefined = itemValue;
        if (props.allowNone && newValue === value()) {
            newValue = undefined;
        }
        setValue(newValue);
        if (props.name && form) {
            setPath(form.value, props.name, newValue);
        }
        props.onChange?.(newValue);
    }

    return (
        <div class="segmented">
            <input type="hidden" name={props.name} value={value()} />
            <For each={Object.keys(props.items)}>
                {(key) => {
                    return (
                        <button
                            type="button"
                            class={cls("segmented-button", {
                                selected: props.items[key] === value(),
                            })}
                            onClick={() => handleClick(props.items[key])}
                        >
                            {key}
                        </button>
                    );
                }}
            </For>
        </div>
    );
};
