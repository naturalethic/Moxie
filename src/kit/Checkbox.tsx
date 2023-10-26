import { Component, Show, splitProps } from "solid-js";

export const Checkbox: Component<{
    name: string;
    label: string;
    tip?: string;
    error?: string;
}> = (props) => {
    const [, inputProps] = splitProps(props, ["label", "error", "tip"]);
    return (
        <label class="flex gap-[5px] tooltip-host select-none">
            <input type="checkbox" {...inputProps} />
            <div
                class="flex items-baseline justify-between"
                data-tip={props.tip}
            >
                <div class="flex gap-1">
                    <div class="text-sm">{props.label}</div>
                    <Show when={props.tip}>
                        <div class="tooltip" data-tip={props.tip}>
                            ?
                        </div>
                    </Show>
                </div>
                <Show when={props.error}>
                    <div class="danger text-xs">{props.error}</div>
                </Show>
            </div>
        </label>

        // <Label label={props.label} error={props.error} tip={props.tip}>
        //     <div class="input-container">
        //         <input {...inputProps} class={cls({ danger: props.error })} />
        //         <Show when={props.leadingIcon}>
        //             <Icon
        //                 name={props.leadingIcon!}
        //                 class="input-leading-icon"
        //             />
        //         </Show>
        //     </div>
        // </Label>
    );
};
