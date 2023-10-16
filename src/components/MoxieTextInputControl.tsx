import { QuestionIcon } from "@primer/octicons-react";
import {
    Box,
    FormControl,
    TextInput,
    TextInputProps,
    Tooltip,
} from "@primer/react";
import { ErrorMessage, Field, FieldProps } from "formik";

export function MoxieTextInputControl(
    props: TextInputProps & { name: string; label?: string; tip?: string },
) {
    const { name, label, tip } = props;
    return (
        <FormControl>
            {label && (
                <FormControl.Label>
                    <Box className="flex gap-2 items-center">
                        {label}
                        {tip && (
                            <Tooltip text={tip} direction="s">
                                <QuestionIcon size={16} />
                            </Tooltip>
                        )}
                    </Box>
                </FormControl.Label>
            )}
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
