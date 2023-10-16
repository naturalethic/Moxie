import { PlusIcon, QuestionIcon, TrashIcon } from "@primer/octicons-react";
import { Box, Tooltip } from "@primer/react";
import { DataTable } from "@primer/react/drafts";
import { Field, FieldProps, useField } from "formik";
import { useEffect, useRef } from "react";

type Row = {
    id: string;
    key: string;
    value: string;
};

export function MoxieAssociative({
    name,
    items = {},
    label,
    tip,
    keyLabel,
    valueLabel,
    keyPlaceholder,
    valuePlaceholder,
}: {
    name: string;
    items: Record<string, string>;
    label?: string;
    tip?: string;
    keyLabel: string;
    valueLabel: string;
    keyPlaceholder: string;
    valuePlaceholder: string;
}) {
    let data: Row[] = [];
    function deriveData() {
        data = [
            {
                id: Math.random().toString(),
                key: "",
                value: "",
            },
            ...Object.entries(items).map(([key, value]) => ({
                id: key,
                key,
                value,
            })),
        ];
    }
    deriveData();
    useEffect(deriveData, [items]);
    const newKey = useRef<HTMLInputElement>(null);
    const newValue = useRef<HTMLInputElement>(null);
    const [, , { setValue }] = useField(name);
    function addNewItem() {
        if (
            newKey.current?.value &&
            newValue.current?.value &&
            !Object.keys(items).includes(newKey.current.value)
        ) {
            setValue({
                ...items,
                [newKey.current.value]: newValue.current.value,
            });
            newKey.current!.value = "";
            newValue.current!.value = "";
            setTimeout(() => {
                newKey.current!.focus();
            }, 1);
        }
    }
    return (
        <Box className="flex flex-col gap-2">
            <Box className="flex gap-2 items-center">
                {label}
                {tip && (
                    <Tooltip text={tip} direction="s">
                        <QuestionIcon size={16} />
                    </Tooltip>
                )}
            </Box>
            <DataTable
                columns={[
                    {
                        id: "id",
                        header: keyLabel,
                        renderCell: (data) => {
                            return data.key ? (
                                <Box>{data.key}</Box>
                            ) : (
                                <input
                                    ref={newKey}
                                    className="border-b"
                                    placeholder={keyPlaceholder}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            addNewItem();
                                        }
                                    }}
                                />
                            );
                        },
                    },
                    {
                        id: "value",
                        header: valueLabel,
                        renderCell: (data) => {
                            return data.key ? (
                                <Field name={`${name}.${data.id}`}>
                                    {({ field }: FieldProps<string>) => (
                                        <input {...field} />
                                    )}
                                </Field>
                            ) : (
                                <input
                                    ref={newValue}
                                    className="border-b"
                                    placeholder={valuePlaceholder}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            addNewItem();
                                        }
                                    }}
                                />
                            );
                        },
                    },
                    {
                        id: "actions",
                        header: "",
                        align: "end",
                        renderCell: (data) => {
                            return data.key ? (
                                <button
                                    type="button"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        const newItems = structuredClone(items);
                                        delete newItems[data.id];
                                        setValue(newItems);
                                    }}
                                >
                                    <TrashIcon />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="cursor-pointer"
                                    onClick={addNewItem}
                                >
                                    <PlusIcon />
                                </button>
                            );
                        },
                    },
                ]}
                data={data}
            />
        </Box>
    );
}
