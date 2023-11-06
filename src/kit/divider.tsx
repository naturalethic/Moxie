import { Component } from "solid-js";
import { Input, object, optional, string } from "valibot";
import { cls } from "~/lib/util";

export const DividerProps = object({
    class: optional(string()),
});

export type DividerProps = Input<typeof DividerProps>;

export const Divider: Component<DividerProps> = (props) => {
    return <hr class={cls("divider", props.class)} />;
};
