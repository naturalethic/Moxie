import { Component } from "solid-js";
import { Infer, object, optional, string } from "~/lib/schema";
import { cls } from "~/lib/util";

export const DividerProps = object({
    class: optional(string()),
});

type DividerProps = Infer<typeof DividerProps>;

export const Divider: Component<DividerProps> = (props) => {
    return <hr class={cls("divider", props.class)} />;
};
