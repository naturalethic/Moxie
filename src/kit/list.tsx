import { Component, For } from "solid-js";
import { formDefault, useForm } from "~/lib/form";
import {
    Infer,
    array,
    boolean,
    object,
    optional,
    special,
    string,
} from "~/lib/schema";
import { TextInput } from "./text-input";

export const ListLab: ListProps = {
    items: ["Screwtape", "Wormwood", "Toadpipe"],
};

export const ListProps = object({
    name: optional(string()),
    items: optional(array(string())),
    small: optional(boolean()),
    onDelete: optional(special<(value: string, index: number) => void>()),
});

type ListProps = Infer<typeof ListProps>;

export const List: Component<ListProps> = (props) => {
    const form = useForm();
    const items = formDefault(form, props.name, props.items, []);
    console.log("List", JSON.stringify(items));

    function handleDelete(index: number) {
        items.splice(index, 1);
        props.onDelete?.(props.items![index], index);
    }
    return (
        <div class="text-xs space-y-1">
            <For each={items}>
                {(value, index) => (
                    <>
                        <TextInput
                            small={props.small}
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
