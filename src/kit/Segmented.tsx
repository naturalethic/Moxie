import { For, createSignal } from "solid-js";
import { cls } from "~/lib/util";
import { Option, optionLabel, optionValue } from "./Option";

type SegementedProps<T extends string> = {
    name: string;
    value?: string;
    options: Option<T>[];
    onChange?: (value: T) => void;
};

export const Segmented = <T extends string,>(props: SegementedProps<T>) => {
    const [value, setValue] = createSignal<string>(
        optionValue(props.value ?? props.options[0]),
    );
    function handleClick(option: Option<T>) {
        setValue(optionValue(option) as string);
        props.onChange?.(optionValue(option));
    }
    return (
        <div class="segmented">
            <input type="hidden" name={props.name} value={value()} />
            <For each={props.options}>
                {(option) => {
                    return (
                        <button
                            type="button"
                            class={cls("segmented-button", {
                                selected: optionValue(option) === value(),
                            })}
                            onClick={() => handleClick(option)}
                        >
                            {optionLabel(option)}
                        </button>
                    );
                }}
            </For>
        </div>
    );
};
