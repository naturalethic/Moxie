import { Component, ParentComponent } from "solid-js";
import { BaseSchema, Input } from "valibot";

type DemoProps<S extends BaseSchema,> = {
    component: Component<Input<S>> | ParentComponent<Input<S>>;
    schema: S;
};

export const Demo = <S extends BaseSchema,>(props: DemoProps<S>) => {
    const componentProps: Input<S> = {
        // shaded: true,
        // children: "test",
    };
    console.log(props.schema);
    // unwrap(props.schema)
    // const schema = props.schema as unknown as ObjectSchema<Input<S>>;
    // const entries = schema.object.entries as Record<string, BaseSchema>;

    // for (const [pkey, pschema] of Object.entries(entries)) {
    //     console.log(pkey, pschema);
    //     // console.log(unwrap(pschema));
    // }

    return (
        <div>
            <div>
                <props.component {...componentProps} />
            </div>
        </div>
    );
};
