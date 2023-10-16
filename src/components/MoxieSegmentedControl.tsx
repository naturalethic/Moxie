import { QuestionIcon } from "@primer/octicons-react";
import { Box, SegmentedControl, SelectProps, Tooltip } from "@primer/react";
import { useField } from "formik";

type Option = {
    value: string;
    label: string;
};

export function MoxieSegmentedControl(
    props: SelectProps & {
        name: string;
        label?: string;
        options: Option[];
        tip?: string;
    },
) {
    const { name, label, options, tip, className } = props;
    const [field, { value }, { setValue }] = useField(name);
    return (
        <Box className={className}>
            <Box className="flex gap-2 items-center">
                {label}
                {tip && (
                    <Tooltip text={tip} direction="s">
                        <QuestionIcon size={16} />
                    </Tooltip>
                )}
            </Box>
            <SegmentedControl
                fullWidth
                aria-label="Select"
                onChange={(index) => {
                    setValue(options![index - 1].value);
                }}
            >
                <input type="hidden" {...field} />
                {props.options?.map((option) => (
                    <SegmentedControl.Button
                        type="button"
                        key={option.value}
                        selected={option.value === value}
                    >
                        {option.label}
                    </SegmentedControl.Button>
                ))}
            </SegmentedControl>
        </Box>
    );
}
