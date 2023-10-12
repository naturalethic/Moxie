import { TextInput, TextInputProps } from "@primer/react";
import { Field, FieldProps } from "formik";

export function MoxieTextInput(props: TextInputProps) {
    const { name } = props;
    return (
        <Field name={name}>
            {({ field, meta }: FieldProps<string>) => (
                <TextInput
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
