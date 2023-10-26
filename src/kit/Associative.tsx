import { Component, For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { Label } from "./Label";
import { TextInput } from "./TextInput";

export const Associative: Component<{
    name: string;
    items?: Record<string, string>;
    label?: string;
    tip?: string;
    keyLabel: string;
    valueLabel: string;
    keyPlaceholder: string;
    valuePlaceholder: string;
}> = (props) => {
    const [items, setItems] = createStore(props.items);
    let headerInput: HTMLInputElement;
    let valueInput: HTMLInputElement;
    function handleEnterNew() {
        const header = headerInput.value;
        const value = valueInput.value;
        if (header && value && !Object.keys(items).includes(header)) {
            setItems((prev) => ({
                ...prev,
                [header]: value,
            }));
            headerInput.value = "";
            valueInput.value = "";
            headerInput.focus();
        }
    }
    function handleDelete(key: string) {
        setItems((prev) => ({
            ...prev,
            [key]: undefined,
        }));
    }
    return (
        <div class="flex flex-col gap-1">
            <Show when={props.label}>
                <Label label={props.label!} tip={props.tip} />
            </Show>
            <div class="text-xs grid grid-cols-2 gap-1">
                <TextInput
                    ref={headerInput!}
                    placeholder="X-Header"
                    size="small"
                    onEnter={handleEnterNew}
                />
                <TextInput
                    ref={valueInput!}
                    placeholder="Value"
                    size="small"
                    onEnter={handleEnterNew}
                />
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
                            <TextInput
                                size="small"
                                placeholder="Value"
                                value={value}
                            />
                        </>
                    )}
                </For>
            </div>
        </div>
    );
};
