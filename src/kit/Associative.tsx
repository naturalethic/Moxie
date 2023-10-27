import { Component, For, Show, useContext } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { cls } from "~/lib/util";
import { Box } from "./Box";
import { FormContext } from "./Form";
import { Option } from "./Option";
import { Select } from "./Select";
import { TextInput } from "./TextInput";

export const Associative: Component<{
    name?: string;
    items?: Record<string, string | undefined>;
    keyPlaceholder?: string;
    valuePlaceholder?: string;
    valueOptions?: Option[];
    submitLabel?: string;
    onSubmit?: (key: string, value: string) => void;
    onDelete?: (key: string) => void;
    onChange?: (key: string, value: string) => void;
}> = (props) => {
    const { form, setForm } = useContext(FormContext);
    const [items, setItems] = createStore(
        structuredClone(
            unwrap(props.items ?? (props.name && form?.[props.name]) ?? {}),
        ),
    );
    let keyField: HTMLInputElement;
    let valueField: HTMLInputElement | HTMLSelectElement;
    function handleSubmit() {
        const key = keyField.value;
        const value = valueField.value;
        if (key && value && !Object.keys(items).includes(key)) {
            if (props.onSubmit) {
                props.onSubmit(key, value);
            } else {
                setItems((prev) => ({
                    ...prev,
                    [key]: value,
                }));
                props.name && setForm?.(props.name, unwrap(items));
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
            setItems((prev) => ({
                ...prev,
                [key]: undefined,
            }));
            // props.name &&
            //     setForm?.({ [props.name]: structuredClone(unwrap(items)) });
            props.name && setForm?.(props.name, structuredClone(unwrap(items)));
            // ref.dispatchEvent(new FieldValueEvent(""));
        }
    }
    let ref: HTMLDivElement;
    return (
        <div class="flex flex-col gap-1" ref={ref!}>
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
                    <button class="col-span-2 text-xs" onClick={handleSubmit}>
                        {props.submitLabel}
                    </button>
                </Show>
            </Box>
            <div class="text-xs grid grid-cols-2 gap-1">
                <For each={Object.entries(items)}>
                    {([key, value]) => (
                        <>
                            <TextInput
                                size="small"
                                value={key}
                                disabled
                                trailingIcon="trash"
                                onClickTrailingIcon={() => handleDelete(key)}
                            />
                            <Show when={!props.valueOptions}>
                                <TextInput
                                    size="small"
                                    placeholder="Value"
                                    value={value}
                                />
                            </Show>
                            <Show when={props.valueOptions}>
                                <Select
                                    options={props.valueOptions}
                                    size="small"
                                    value={value}
                                    onChange={(value: string) =>
                                        props.onChange?.(key, value)
                                    }
                                />
                            </Show>
                        </>
                    )}
                </For>
            </div>
        </div>
    );
};
