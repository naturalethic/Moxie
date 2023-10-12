import { Checkbox, CheckboxProps, FormControl } from "@primer/react";
import { Field, FieldProps } from "formik";

export function MoxieCheckbox(props: CheckboxProps & { label: string }) {
    const { name, value, label } = props;
    return (
        <Field name={name} type="checkbox" value={value}>
            {({ field, meta }: FieldProps<string>) => (
                <FormControl>
                    <Checkbox
                        {...field}
                        {...props}
                        validationStatus={
                            meta.touched && meta.error ? "error" : undefined
                        }
                    />
                    <FormControl.Label>{label}</FormControl.Label>
                </FormControl>
            )}
        </Field>
    );
}
