import { QuestionIcon } from "@primer/octicons-react";
import {
    Box,
    Checkbox,
    CheckboxProps,
    FormControl,
    Tooltip,
} from "@primer/react";
import { Field, FieldProps } from "formik";

export function MoxieCheckbox(
    props: CheckboxProps & { label: string; tip?: string },
) {
    const { name, value, label, tip } = props;
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
                </FormControl>
            )}
        </Field>
    );
}
