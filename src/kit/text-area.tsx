import { Component, splitProps } from "solid-js";
import {
    Infer,
    boolean,
    number,
    object,
    optional,
    special,
    string,
} from "~/lib/schema";
import { cls, getPath, setPath } from "~/lib/util";
import { useForm } from "../lib/form";
import { Label } from "./label";

export const TextAreaLab: TextAreaProps = {
    placeholder: "Enter some text...",
    lines: 10,
};

export const TextAreaProps = object({
    name: optional(string()),
    placeholder: optional(string()),
    label: optional(string()),
    lines: optional(number()),
    resizable: optional(boolean()),
    disabled: optional(boolean()),
    tip: optional(string()),
    error: optional(string()),
    small: optional(boolean()),
    value: optional(string()),
    onEnter: optional(special<() => void>()),
    onChange: optional(special<(value: string) => void>()),
});

type TextAreaProps = Infer<typeof TextAreaProps>;

export const TextArea: Component<TextAreaProps> = (props) => {
    const [, inputProps] = splitProps(props, [
        "label",
        "lines",
        "resizable",
        "tip",
        "error",
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
                <textarea
                    {...inputProps}
                    rows={props.lines}
                    class={cls({
                        "resize-none": !props.resizable,
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
                >
                    {props.value ??
                        (props.name &&
                            form &&
                            (getPath(form.value, props.name) as string))}
                </textarea>
            </div>
        </Label>
    );
};
