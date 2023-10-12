import { Select, SelectProps } from "@primer/react";
import { Field, FieldProps } from "formik";

export function MoxieSelect(props: SelectProps) {
    const { name } = props;
    return (
        <Field name={name}>
            {({ field, meta }: FieldProps<string>) => (
                <Select
                    {...field}
                    {...props}
                    validationStatus={
                        meta.touched && meta.error ? "error" : undefined
                    }
                />
            )}
        </Field>
    );
}
