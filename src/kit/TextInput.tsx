import {
    Component,
    Show,
    createEffect,
    splitProps,
    useContext,
} from "solid-js";
import { Icon } from "~/kit/Icon";
import { cls } from "~/lib/util";
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
    const { form, setForm, error, setError } = useContext(FormContext);

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === "Enter" && props.onEnter) {
            event.preventDefault();
            props.onEnter();
        }
    }

    function handleInput(event: InputEvent) {
        const input = event.target as HTMLInputElement;
        if (props.name && setForm && setError) {
            setForm(props.name, input.value);
            setError(props.name, undefined);
        }
        props.onChange?.(input.value);
    }

    function handleFocus() {
        if (props.name && setError) {
            setError(props.name, undefined);
        }
    }

    createEffect(() => {
        // Initialize the form data value for this input to an empty string, if it is not yet defined.
        if (form && setForm && props.name && form[props.name] === undefined) {
            setForm(props.name.split("."), "");
        }
    });

    return (
        <Label
            label={props.label}
            error={props.error ?? (props.name && error?.[props.name])}
            tip={props.tip}
        >
            <div class="input-container">
                <input
                    {...inputProps}
                    value={
                        props.value ??
                        (props.name && (form?.[props.name] as string))
                    }
                    class={cls({
                        "border-danger":
                            props.error ?? (props.name && error?.[props.name]),
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
