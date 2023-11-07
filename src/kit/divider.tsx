import { Component } from "solid-js";
import { Infer, object, string } from "~/lib/schema";
// import { Input, object, optional, string } from "valibot";
import { cls } from "~/lib/util";

export const DividerProps = object({
    class: string(),
});

type DividerProps = Infer<typeof DividerProps>;

export const Divider: Component<DividerProps> = (props) => {
    return <hr class={cls("divider", props.class)} />;
};
