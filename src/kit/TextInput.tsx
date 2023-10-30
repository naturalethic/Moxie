import {
    Component,
    Show,
    createEffect,
    splitProps,
    useContext,
} from "solid-js";
import { Icon } from "~/kit/Icon";
import { cls, getPath, setPath } from "~/lib/util";
import { FormContext } from "./Form";
import { Label } from "./Label";

export const TextInput: Component<{
    type?: string;
    name?: string;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    tip?: string;
    error?: string;
    leadingIcon?: string;
    trailingIcon?: string;
    onClickTrailingIcon?: () => void;
    size?: "small" | "normal";
    value?: string;
    onEnter?: () => void;
    onChange?: (value: string) => void;
}> = (props) => {
    const [, inputProps] = splitProps(props, [
        "label",
        "tip",
        "error",
        "leadingIcon",
        "size",
        "value",
        "onEnter",
        "onChange",
    ]);
    const size = props.size ?? "normal";
    const form = useContext(FormContext);

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

    function handleFocus() {
        if (props.name && form) {
            setPath(form.error, props.name, undefined);
        }
    }

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
                        "text-sm": !props.size || props.size === "normal",
                        "text-xs": props.size === "small",
                    })}
                    onKeyPress={handleKeyPress}
                    onInput={handleInput}
                    onFocus={handleFocus}
                />
                <Show when={props.leadingIcon}>
                    <Icon
                        name={props.leadingIcon!}
                        class={`input-icon input-leading-icon input-leading-icon-${size}`}
                    />
                </Show>
                <Show when={props.trailingIcon}>
                    <Icon
                        name={props.trailingIcon!}
                        class={`input-icon input-trailing-icon input-trailing-icon-${size}`}
                        onClick={props.onClickTrailingIcon}
                    />
                </Show>
            </div>
        </Label>
    );
};
