import { Component, For } from "solid-js";
import { createMutable } from "solid-js/store";
import { useForm } from "~/lib/form";
import {
    Infer,
    array,
    boolean,
    object,
    optional,
    special,
    string,
} from "~/lib/schema";
import { getPath, setPath } from "~/lib/util";
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

    const items =
        props.name && form
            ? getPath<string[]>(form.value, props.name) ?? []
            : createMutable<string[]>(props.items ?? []);

    if (props.name && form) {
        if (!getPath(form.value, props.name)) {
            setPath(form.value, props.name, items);
        }
    }

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
