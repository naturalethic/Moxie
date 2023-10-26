import { For } from "solid-js";
import { createStore } from "solid-js/store";
import { cls } from "~/lib/util";
import { Option, optionLabel, optionValue } from "./Option";

type SegementedProps<T extends string> = {
    name: string;
    defaultValue?: string;
    options: Option<T>[];
    onChange?: (value: T) => void;
};

export const Segmented = <T extends string,>(props: SegementedProps<T>) => {
    const [state, setState] = createStore<{ value: string }>({
        value: optionValue(props.options[0]),
    });
    function handleClick(option: Option<T>) {
        setState("value", optionValue(option));
        props.onChange?.(optionValue(option));
    }
    return (
        <div class="segmented">
            <input type="hidden" name={props.name} value={state.value} />
            <For each={props.options}>
                {(option) => {
                    return (
                        <button
                            type="button"
                            class={cls("segmented-button", {
                                selected: optionValue(option) === state.value,
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
