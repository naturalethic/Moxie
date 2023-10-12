import {
    Box,
    Button,
    FormControl,
    NavList,
    PageLayout,
    Select,
} from "@primer/react";
import { Form, Formik } from "formik";
import { last } from "rambda";
import { useState } from "react";
import { object, string } from "yup";
import { MoxieSelect } from "~/components/MoxieSelect";
import { MoxieTextInput } from "~/components/MoxieTextInput";
import { createDomain, reloadDomains, useAccounts } from "~/lib/api";

export function Domain({ name }: { name?: string }) {
    const [selectedItem, setSelectedItem] = useState("addresses");
    return (
        <PageLayout padding="none" columnGap="none" rowGap="none">
            <PageLayout.Pane position="start" width="small" divider="line">
                <NavList>
                    {!name ? (
                        <NavList.Item aria-current={true}>
                            New domain details
                        </NavList.Item>
                    ) : (
                        <NavList.Item
                            aria-current={selectedItem === "addresses"}
                            onClick={() => setSelectedItem("addresses")}
                        >
                            Addresses
                        </NavList.Item>
                    )}
                </NavList>
            </PageLayout.Pane>
            <PageLayout.Content
                padding="none"
                sx={{ paddingLeft: 2, paddingTop: 2 }}
            >
                {name === "new" ? (
                    <NewDomain />
                ) : (
                    selectedItem === "addresses" && <div>Addressess</div>
                )}
            </PageLayout.Content>
        </PageLayout>
    );
}

export function NewDomain() {
    const accounts = useAccounts();

    return (
        <Formik
            initialValues={{ name: "", username: accounts[0] }}
            onSubmit={async ({ name, username }, actions) => {
                console.log(name, username);
                try {
                    await createDomain(name, username);
                    reloadDomains();
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
                            <MoxieTextInput name="name" block />
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
                            <MoxieSelect block name="username">
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
