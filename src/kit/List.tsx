import { Component, For } from "solid-js";
import { TextInput } from "./TextInput";

export const List: Component<{
    items?: string[];
    size?: "small" | "normal";
    onDelete?: (value: string, index: number) => void;
}> = (props) => {
    const size = props.size ?? "normal";
    function handleDelete(index: number) {
        props.onDelete?.(props.items![index], index);
    }
    return (
        <div class="text-xs space-y-1">
            <For each={props.items}>
                {(value, index) => (
                    <>
                        <TextInput
                            size={size}
                            value={value}
                            disabled
                            trailingIcon="trash"
                            onClickTrailingIcon={() => handleDelete(index())}
                        />
                    </>
                )}
            </For>
        </div>
    );
};
