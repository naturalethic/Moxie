import {
    Component,
    Show,
    createSignal,
    splitProps,
    useContext,
} from "solid-js";
import { cls, getPath } from "~/lib/util";
import { FormContext } from "./form";
import { Label } from "./label";

export const FileInput: Component<{
    name?: string;
    label?: string;
    disabled?: boolean;
    tip?: string;
    error?: string;
    size?: "small" | "normal";
    accept?: string;
    onChange?: (file: File) => void;
}> = (props) => {
    const [, inputProps] = splitProps(props, [
        "label",
        "tip",
        "error",
        "size",
        "onChange",
    ]);
    const size = props.size ?? "normal";
    const form = useContext(FormContext);

    let fileInput: HTMLInputElement;
    let fileButton: HTMLButtonElement;
    const [fileName, setFileName] = createSignal("");

    function handleFileClick() {
        fileInput.click();
    }

    function handleFileChange() {
        const file = fileInput.files?.item(0);
        if (file) {
            setFileName(file.name);
            props.onChange?.(file);
        }
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
            <div class="file-input-container">
                <input
                    {...inputProps}
                    ref={fileInput!}
                    type="file"
                    class="hidden"
                    onChange={handleFileChange}
                />
                <Show when={fileName()}>
                    <div>{fileName()}</div>
                </Show>
                <button
                    ref={fileButton!}
                    type="button"
                    class={cls("break-all", {
                        "border-danger":
                            props.error ??
                            (props.name &&
                                form &&
                                getPath(form.error, props.name)),
                        "text-xs": size === "small",
                        "text-sm": size === "normal",
                    })}
                    onClick={handleFileClick}
                >
                    {"Choose File"}
                </button>
            </div>
        </Label>
    );
};
