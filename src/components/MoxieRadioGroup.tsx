import { FormControl, Radio, RadioGroup, SelectProps } from "@primer/react";
import { ErrorMessage, Field, FieldProps } from "formik";

export function MoxieRadioGroup(
    props: SelectProps & { name: string; label?: string; options?: string[] },
) {
    const { name, label } = props;
    return (
        <RadioGroup name={name}>
            <RadioGroup.Label visuallyHidden={!label}>
                {label ?? ""}
            </RadioGroup.Label>
            {props.options?.map((option) => (
                <Field key={option} name={name}>
                    {({ field }: FieldProps<string>) => (
                        <FormControl>
                            <FormControl.Label>{option}</FormControl.Label>
                            <Radio
                                {...field}
                                value={option}
                                defaultChecked={field.value === option}
                            />
                        </FormControl>
                    )}
                </Field>
            ))}
            <ErrorMessage name={name}>
                {(message) => (
                    <RadioGroup.Validation variant="error">
                        {message}
                    </RadioGroup.Validation>
                )}
            </ErrorMessage>
        </RadioGroup>
    );
}
