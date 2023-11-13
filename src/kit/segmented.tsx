import {
    Component,
    For,
    createEffect,
    createRenderEffect,
    createSignal,
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
    value: optional(unknown()),
    items: union(
        array(unknown()),
        record(unknown()),
        record(string()), // provides a type the lab understands
    ),
    allowNone: optional(boolean()),
    onChange: optional(special<(value: unknown) => void>()),
});

type SegementedProps = Infer<typeof SegmentedProps>;

export const Segmented: Component<SegementedProps> = (props) => {
    const form = useForm();

    // XXX: This pattern with items of array or object type, is repeated in other components.
    //      Abstract it.  (Same with value below)
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

    function handleClick(itemValue: unknown) {
        let newValue = itemValue;
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
            <For each={Object.keys(items())}>
                {(key) => {
                    return (
                        <button
                            type="button"
                            class={cls("segmented-button", {
                                selected: items()[key] === value(),
                            })}
                            onClick={() => handleClick(items()[key])}
                        >
                            {key}
                        </button>
                    );
                }}
            </For>
        </div>
    );
};
