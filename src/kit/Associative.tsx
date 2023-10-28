import { Component, Index, Show, useContext } from "solid-js";
import { createMutable, unwrap } from "solid-js/store";
import { cls, getPath } from "~/lib/util";
import { Box } from "./Box";
import { FormContext } from "./Form";
import { Option } from "./Option";
import { Select } from "./Select";
import { TextInput } from "./TextInput";

type Items = Record<string, string>;

export const Associative: Component<{
    name?: string;
    items?: Items;
    keyPlaceholder?: string;
    valuePlaceholder?: string;
    valueOptions?: Option[];
    submitLabel?: string;
    onSubmit?: (key: string, value: string) => void;
    onDelete?: (key: string) => void;
    onChange?: (key: string, value: string) => void;
}> = (props) => {
    const form = useContext(FormContext);
    // XXX: This isn't used if their is a form, so maybe don't create it.
    //      Clean up this distinction.
    const items = createMutable(structuredClone(unwrap(props.items ?? {})));
    let keyField: HTMLInputElement;
    let valueField: HTMLInputElement | HTMLSelectElement;
    function handleSubmit() {
        const key = keyField.value;
        const value = valueField.value;
        const values =
            form && props.name
                ? (getPath(form.value, props.name) as Items)
                : items;
        if (key && value && !Object.keys(values).includes(key)) {
            if (props.onSubmit) {
                props.onSubmit(key, value);
            } else {
                if (form && props.name) {
                    values[key] = value;
                } else {
                    items[key] = value;
                }
            }
            if (!props.valueOptions) {
                valueField.value = "";
            }
            keyField.value = "";
            keyField.focus();
        }
    }
    function handleDelete(key: string) {
        if (props.onDelete) {
            props.onDelete(key);
        } else {
            if (form && props.name) {
                const values = getPath<Items>(form.value, props.name)!;
                delete values[key];
            } else {
                delete items[key];
            }
        }
    }

    return (
        <div class="flex flex-col gap-1">
            <Box
                class={cls("grid grid-cols-2 gap-1", {
                    "p-2 mb-1": props.submitLabel,
                })}
                shaded={!!props.submitLabel}
            >
                <TextInput
                    ref={keyField!}
                    placeholder={props.keyPlaceholder}
                    size="small"
                    onEnter={handleSubmit}
                />
                <Show when={!props.valueOptions}>
                    <TextInput
                        ref={valueField!}
                        placeholder={props.valuePlaceholder}
                        size="small"
                        onEnter={handleSubmit}
                    />
                </Show>
                <Show when={props.valueOptions}>
                    <Select
                        options={props.valueOptions}
                        size="small"
                        ref={valueField!}
                    />
                </Show>
                <Show when={props.submitLabel}>
                    <button
                        type="button"
                        class="col-span-2 text-xs"
                        onClick={handleSubmit}
                    >
                        {props.submitLabel}
                    </button>
                </Show>
            </Box>
            <div class="text-xs grid grid-cols-2 gap-1">
                <Index
                    each={Object.entries(
                        (form &&
                            props.name &&
                            getPath(form.value, props.name)) ??
                            items,
                    ).map(([key, value]) => ({
                        key,
                        value,
                    }))}
                >
                    {(item) => (
                        <>
                            <TextInput
                                size="small"
                                value={item().key}
                                disabled
                                trailingIcon="trash"
                                onClickTrailingIcon={() =>
                                    handleDelete(item().key)
                                }
                            />
                            <Show when={!props.valueOptions}>
                                <TextInput
                                    size="small"
                                    placeholder="Value"
                                    value={item().value}
                                    onChange={(value) =>
                                        props.onChange?.(item().key, value)
                                    }
                                />
                            </Show>
                            <Show when={props.valueOptions}>
                                <Select
                                    options={props.valueOptions}
                                    size="small"
                                    value={item().value}
                                    onChange={(value: string) =>
                                        props.onChange?.(item().key, value)
                                    }
                                />
                            </Show>
                        </>
                    )}
                </Index>
            </div>
        </div>
    );
};
