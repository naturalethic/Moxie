import { Component } from "solid-js";
import { Infer, boolean, object, string } from "~/lib/schema";
// import { Input, object, optional, string } from "valibot";
import { cls } from "~/lib/util";

export const DividerProps = object({
    class: string(),
    foo: boolean(),
    bar: object({
        baz: string(),
        bam: boolean(),
    }),
});

type DividerProps = Infer<typeof DividerProps>;

export const Divider: Component<DividerProps> = (props) => {
    return <hr class={cls("divider", props.class)} />;
};
