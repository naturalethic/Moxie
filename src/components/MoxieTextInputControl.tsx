import { FormControl, TextInput, TextInputProps } from "@primer/react";
import { ErrorMessage, Field, FieldProps } from "formik";

export function MoxieTextInputControl(
    props: TextInputProps & { name: string; label?: string },
) {
    const { name, label } = props;
    return (
        <FormControl>
            {label && <FormControl.Label>{label}</FormControl.Label>}
            <Field name={name}>
                {({ field, meta }: FieldProps<string>) => (
                    <TextInput
                        {...field}
                        {...props}
                        validationStatus={
                            (meta.touched && meta.error && "error") || undefined
                        }
                    />
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
