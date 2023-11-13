import { Component, Index, Show } from "solid-js";
import { Infer, object, optional, record, special, string } from "~/lib/schema";
import { formDefault, useForm } from "../lib/form";
import { Option } from "../lib/option";
import { Box } from "./box";
import { Button } from "./button";
import { Select } from "./select";
import { TextInput } from "./text-input";

export const AssociativeLab: Partial<AssociativeProps> = {
    name: "headers",
    keyPlaceholder: "Key",
    valuePlaceholder: "Value",
    submitLabel: "Add Header",
    items: {
        "Content-Type": "text/plain",
        "Content-Length": "0",
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/244.178.44.111 Safari/537.36",
    },
};

export const AssociativeProps = object({
    name: optional(string()),
    items: optional(record(string())),
    keyPlaceholder: optional(string()),
    valuePlaceholder: optional(string()),
    valueOptions: optional(special<Option<string>[]>()),
    submitLabel: optional(string()),
    onChange: optional(special<(key: string, value: string) => void>()),
    onDelete: optional(special<(key: string) => void>()),
    onSubmit: optional(special<(key: string, value: string) => void>()),
});

type AssociativeProps = Infer<typeof AssociativeProps>;

export const Associative: Component<AssociativeProps> = (props) => {
    const form = useForm();
    const items = formDefault(form, props.name, props.items, {});

    let keyInput: HTMLInputElement;
    let valueInput: HTMLInputElement | HTMLSelectElement;

    function handleSubmit() {
        const key = keyInput.value;
        const value = valueInput.value;
        if (key && value && !Object.keys(items).includes(key)) {
            items[key] = value;
            if (!props.valueOptions) {
                valueInput.value = "";
            }
            keyInput.value = "";
            keyInput.focus();
            props.onSubmit?.(key, value);
        }
    }

    function handleChange(key: string, value: string | number) {
        // XXX: Update this component to allow numbers here,
        //      and use the items pattern from select/segmented.
        items[key] = value as string;
        props.onChange?.(key, value as string);
    }

    function handleDelete(key: string) {
        delete items[key];
        props.onDelete?.(key);
    }

    return (
        <div class="flex flex-col gap-1">
            <Box
                // class={cls({
                //     "p-2 mb-1": props.submitLabel,
                // })}
                contentClass="grid grid-cols-2 gap-1"
                // shaded={!!props.submitLabel}
            >
                <TextInput
                    ref={keyInput!}
                    placeholder={props.keyPlaceholder}
                    small
                    onEnter={handleSubmit}
                />
                <Show when={!props.valueOptions}>
                    <TextInput
                        ref={valueInput!}
                        placeholder={props.valuePlaceholder}
                        small
                        onEnter={handleSubmit}
                    />
                </Show>
                <Show when={props.valueOptions}>
                    <Select
                        items={props.valueOptions!}
                        small
                        ref={valueInput!}
                    />
                </Show>
                <Show when={props.submitLabel}>
                    <Button small stretch class="col-span-2">
                        {props.submitLabel}
                    </Button>
                </Show>
            </Box>
            <div class="text-xs grid grid-cols-2 gap-1">
                <Index
                    each={Object.entries(items).map(([key, value]) => ({
                        key,
                        value,
                    }))}
                >
                    {(item) => (
                        <>
                            <TextInput
                                small
                                value={item().key}
                                disabled
                                trailingIcon="trash"
                                onClickTrailingIcon={() =>
                                    handleDelete(item().key)
                                }
                            />
                            <Show when={!props.valueOptions}>
                                <TextInput
                                    small
                                    placeholder="Value"
                                    value={item().value}
                                    onChange={(value) =>
                                        handleChange(item().key, value)
                                    }
                                />
                            </Show>
                            <Show when={props.valueOptions}>
                                <Select
                                    items={props.valueOptions!}
                                    small
                                    value={item().value}
                                    onChange={(value) =>
                                        handleChange(
                                            item().key,
                                            value as string,
                                        )
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
