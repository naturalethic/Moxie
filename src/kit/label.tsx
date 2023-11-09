import { ParentComponent, Show } from "solid-js";
import { Infer, object, optional, string } from "~/lib/schema";
import { cls } from "~/lib/util";

export const LabelDemo: LabelProps = {
    label: "Favorite book",
    error: "Some error",
    tip: "Some tip",
};

export const LabelProps = object({
    label: optional(string()),
    error: optional(string()),
    tip: optional(string()),
    class: optional(string()),
});

type LabelProps = Infer<typeof LabelProps>;

export const Label: ParentComponent<LabelProps> = (props) => {
    return (
        <label class={`flex flex-col gap-[2px] select-none ${props.class}`}>
            <Show when={props.label}>
                <div
                    class="flex items-baseline justify-between tooltip-host"
                    data-tip={props.tip}
                >
                    <div class="flex gap-1">
                        <div class={cls("text-sm")}>{props.label}</div>
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
