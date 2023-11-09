import { Component, Show, createSignal, splitProps } from "solid-js";
import {
    Infer,
    boolean,
    object,
    optional,
    special,
    string,
} from "~/lib/schema";
import { cls, getPath } from "~/lib/util";
import { useForm } from "../lib/form";
import { Label } from "./label";

export const FileInputProps = object({
    name: optional(string()),
    label: optional(string()),
    disabled: optional(boolean()),
    tip: optional(string()),
    error: optional(string()),
    size: optional(special<"small" | "normal">()),
    accept: optional(string()),
    onChange: optional(special<(file: File) => void>()),
});

type FileInputProps = Infer<typeof FileInputProps>;

export const FileInput: Component<FileInputProps> = (props) => {
    const [, inputProps] = splitProps(props, [
        "label",
        "tip",
        "error",
        "size",
        "onChange",
    ]);
    const size = props.size ?? "normal";
    const form = useForm();

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
