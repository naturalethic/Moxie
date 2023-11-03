import { ParentComponent, Show } from "solid-js";

export const Label: ParentComponent<{
    label?: string;
    error?: string;
    tip?: string;
    class?: string;
}> = (props) => {
    return (
        <label class={`flex flex-col gap-[2px] select-none ${props.class}`}>
            <Show when={props.label}>
                <div
                    class="flex items-baseline justify-between tooltip-host"
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
                        <div class="text-danger text-xs">{props.error}</div>
                    </Show>
                </div>
            </Show>
            {props.children}
        </label>
    );
};
