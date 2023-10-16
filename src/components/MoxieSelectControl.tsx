import { FormControl, Select, SelectProps } from "@primer/react";
import { ErrorMessage, Field, FieldProps } from "formik";

export function MoxieSelectControl(
    props: SelectProps & { name: string; label?: string; options?: string[] },
) {
    const { name, label } = props;
    return (
        <FormControl>
            {label && <FormControl.Label>{label}</FormControl.Label>}

            <Field name={name}>
                {({ field, meta }: FieldProps<string>) => (
                    <Select
                        {...field}
                        {...props}
                        validationStatus={
                            meta.touched && meta.error ? "error" : undefined
                        }
                    >
                        {props.options?.map((option) => (
                            <Select.Option key={option} value={option}>
                                {option}
                            </Select.Option>
                        ))}
                    </Select>
                )}
            </Field>
            <ErrorMessage name={name}>
                {(message) => (
                    <FormControl.Validation variant="error">
                        {message}
                    </FormControl.Validation>
                )}
            </ErrorMessage>
        </FormControl>
    );
}
