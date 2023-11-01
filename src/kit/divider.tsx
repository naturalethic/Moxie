import { Component } from "solid-js";
import { cls } from "~/lib/util";

export const Divider: Component<{ class?: string }> = (props) => {
    return <hr class={cls("divider", props.class)} />;
};
