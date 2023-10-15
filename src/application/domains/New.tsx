import { Box, Button, FormControl, Select } from "@primer/react";
import { Form, Formik } from "formik";
import { last } from "rambda";
import { object, string } from "yup";
import { MoxieSelect } from "~/components/MoxieSelect";
import { MoxieTextInput } from "~/components/MoxieTextInput";
import { createDomain, reloadDomains, useAccounts } from "~/lib/api";

export function New() {
    const accounts = useAccounts();

    return (
        <Formik
            initialValues={{ name: "", username: accounts[0] }}
            onSubmit={async ({ name, username }, actions) => {
                try {
                    await createDomain(name, username);
                    reloadDomains();
                    actions.resetForm();
                } catch (e) {
                    actions.setErrors({
                        name: "x",
                    });
                    actions.setStatus(last((e as Error).message.split(":")));
                }
            }}
            validationSchema={object({
                name: string().required(),
                username: string().required(),
            })}
        >
            {({ dirty, status }) => (
                <Form>
                    <Box className="space-y-2">
                        <FormControl>
                            <FormControl.Label>Domain name</FormControl.Label>
                            <MoxieTextInput name="name" />
                            {dirty && status && (
                                <FormControl.Validation variant="error">
                                    {status}
                                </FormControl.Validation>
                            )}
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>
                                Postmaster / Reporting account
                            </FormControl.Label>
                            <MoxieSelect name="username">
                                {accounts?.map((account) => (
                                    <Select.Option
                                        key={account}
                                        value={account}
                                    >
                                        {account}
                                    </Select.Option>
                                ))}
                            </MoxieSelect>
                        </FormControl>
                        <Button type="submit">Add new domain</Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
}
