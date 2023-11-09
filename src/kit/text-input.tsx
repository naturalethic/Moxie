import { Component, Show, createEffect, splitProps } from "solid-js";
import { Icon } from "~/kit/icon";
import {
    Infer,
    boolean,
    object,
    optional,
    special,
    string,
} from "~/lib/schema";
import { cls, getPath, setPath } from "~/lib/util";
import { useForm } from "../lib/form";
import { Label } from "./label";

export const TextInputLab: TextInputProps = {
    placeholder: "Enter some text...",
    label: "Favorite book",
    trailingIcon: "circle-plus",
};

export const TextInputProps = object({
    type: optional(string()),
    name: optional(string()),
    placeholder: optional(string()),
    label: optional(string()),
    disabled: optional(boolean()),
    tip: optional(string()),
    error: optional(string()),
    leadingIcon: optional(string()),
    trailingIcon: optional(string()),
    onClickTrailingIcon: optional(special<() => void>()),
    small: optional(boolean()),
    value: optional(string()),
    onEnter: optional(special<() => void>()),
    onChange: optional(special<(value: string) => void>()),
});

type TextInputProps = Infer<typeof TextInputProps>;

export const TextInput: Component<TextInputProps> = (props) => {
    const [, inputProps] = splitProps(props, [
        "label",
        "tip",
        "error",
        "leadingIcon",
        "small",
        "value",
        "onEnter",
        "onChange",
    ]);
    const form = useForm();

    function size() {
        return props.small ? "small" : "normal";
    }

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === "Enter" && props.onEnter) {
            event.preventDefault();
            props.onEnter();
        }
    }

    function handleInput(event: InputEvent) {
        const input = event.target as HTMLInputElement;
        if (props.name && form) {
            setPath(form.value, props.name, input.value);
            setPath(form.error, props.name, undefined);
        }
        props.onChange?.(input.value);
    }

    // function handleFocus() {
    //     if (props.name && form) {
    //         setPath(form.error, props.name, undefined);
    //     }
    // }

    createEffect(() => {
        // Initialize the form data value for this input to an empty string, if it is not yet defined.
        if (
            form &&
            props.name &&
            getPath(form.value, props.name) === undefined
        ) {
            setPath(form.value, props.name, "");
        }
    });

    return (
        <Label
            label={props.label}
            error={
                props.error ??
                (props.name &&
                    form &&
                    (getPath(form.error, props.name) as string))
            }
            tip={props.tip}
        >
            <div class="input-container">
                <input
                    {...inputProps}
                    value={
                        props.value ??
                        (props.name &&
                            form &&
                            (getPath(form.value, props.name) as string))
                    }
                    class={cls({
                        "border-danger":
                            props.error ??
                            (props.name &&
                                form &&
                                getPath(form.error, props.name)),
                        "text-xs": size() === "small",
                        "text-sm": size() === "normal",
                    })}
                    placeholder={props.placeholder}
                    onKeyPress={handleKeyPress}
                    onInput={handleInput}
                    // onFocus={handleFocus}
                />
                <Show when={props.leadingIcon}>
                    <Icon
                        name={props.leadingIcon!}
                        class={`input-icon input-leading-icon input-leading-icon-${size()}`}
                    />
                </Show>
                <Show when={props.trailingIcon}>
                    <Icon
                        name={props.trailingIcon!}
                        class={`input-icon input-trailing-icon input-trailing-icon-${size()}`}
                        onClick={props.onClickTrailingIcon}
                    />
                </Show>
            </div>
        </Label>
    );
};
