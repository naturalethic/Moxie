import { PlusIcon, TrashIcon } from "@primer/octicons-react";
import { Box } from "@primer/react";
import { DataTable } from "@primer/react/drafts";
import { Field, FieldProps, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { MoxieNavLayout } from "~/components/MoxieNavLayout";
import {
    createEmail,
    deleteEmail,
    reloadDomainLocalparts,
    useAccounts,
    useDomainLocalparts,
} from "~/lib/api";

type Address = {
    id: string;
    localpart: string;
    account: string;
};

export function Domain({ name }: { name: string }) {
    const localparts = useDomainLocalparts(name);
    const accounts = useAccounts();

    const [data, setData] = useState<Address[]>([]);
    useEffect(() => {
        setData([
            { id: Math.random().toString(), localpart: "", account: "" },
            ...Object.entries(localparts ?? {}).map(([localpart, account]) => {
                return { id: localpart, localpart, account };
            }),
        ]);
    }, [localparts]);

    return (
        <MoxieNavLayout>
            <MoxieNavLayout.Item id="addresses" label="Addresses">
                <Formik
                    initialValues={{ localpart: "", username: accounts[0] }}
                    onSubmit={async ({ localpart, username }, actions) => {
                        if (!localpart) {
                            return;
                        }
                        await createEmail(
                            username,
                            `${localpart === "*" ? "" : localpart}@${name}`,
                        );
                        actions.resetForm();
                        reloadDomainLocalparts(name);
                    }}
                >
                    <Form>
                        <DataTable
                            columns={[
                                {
                                    id: "id",
                                    header: "Localpart",
                                    renderCell: (data) => {
                                        return data.account ? (
                                            <Box>
                                                {data.account && !data.localpart
                                                    ? "*"
                                                    : data.localpart}
                                            </Box>
                                        ) : (
                                            <Field name="localpart">
                                                {({
                                                    field,
                                                }: FieldProps<string>) => (
                                                    <input
                                                        {...field}
                                                        className="border-b"
                                                    />
                                                )}
                                            </Field>
                                        );
                                    },
                                },
                                {
                                    id: "account",
                                    header: "Account",
                                    renderCell: (data) => {
                                        return data.account ? (
                                            <Box className="pl-1">
                                                {data.account}
                                            </Box>
                                        ) : (
                                            <Field name="username">
                                                {({
                                                    field,
                                                }: FieldProps<string>) => (
                                                    <select {...field}>
                                                        {accounts.map(
                                                            (username) => (
                                                                <option
                                                                    key={
                                                                        username
                                                                    }
                                                                >
                                                                    {username}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                )}
                                            </Field>
                                        );
                                    },
                                },
                                {
                                    id: "actions",
                                    header: "",
                                    align: "end",
                                    renderCell: (data) => {
                                        return data.account ? (
                                            <button
                                                className="cursor-pointer"
                                                onClick={async () => {
                                                    await deleteEmail(
                                                        `${data.localpart}@${name}`,
                                                    );
                                                    reloadDomainLocalparts(
                                                        name,
                                                    );
                                                }}
                                            >
                                                <TrashIcon />
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                className="cursor-pointer"
                                            >
                                                <PlusIcon />
                                            </button>
                                        );
                                    },
                                },
                            ]}
                            data={data}
                        />
                    </Form>
                </Formik>
            </MoxieNavLayout.Item>
        </MoxieNavLayout>
    );
}
