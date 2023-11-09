import { Component, For, createSignal, useContext } from "solid-js";
import { cls, setPath } from "~/lib/util";
import { FormContext } from "../lib/form";
import { Option, optionLabel, optionValue } from "../lib/option";

type SegementedProps = {
    name: string;
    value?: string;
    options: Option<string>[];
    allowNone?: boolean;
    onChange?: (value: string | undefined) => void;
};

export const Segmented: Component<SegementedProps> = (props) => {
    const form = useContext(FormContext);

    const [value, setValue] = createSignal<string | undefined>(
        (props.value ?? (!props.allowNone && optionValue(props.options[0]))) ||
            undefined,
    );

    function handleClick(option: Option<string>) {
        let newValue: string | undefined = optionValue(option);
        if (props.allowNone && newValue === value()) {
            newValue = undefined;
        }
        setValue(newValue);
        props.onChange?.(newValue);
        if (props.name && form) {
            setPath(form.value, props.name, newValue);
        }
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
