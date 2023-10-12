import { MentionIcon } from "@primer/octicons-react";
import { Box, Button, CheckboxGroup, FormControl } from "@primer/react";
import { ErrorMessage, Form, Formik } from "formik";
import { last } from "rambda";
import { useState } from "react";
import { array, object, string } from "yup";
import { MoxieCheckbox } from "~/components/MoxieCheckbox";
import { MoxieTextInput } from "~/components/MoxieTextInput";
import {
    createAccount,
    createEmail,
    reloadAccounts,
    useDomains,
} from "~/lib/api";

export function New() {
    const domains = useDomains();
    const [previousUsernameValue, setPreviousUsernameValue] = useState("");

    return (
        <Formik
            initialValues={{
                username: "",
                localpart: "",
                domains: [],
            }}
            onSubmit={async ({ username, localpart, domains }, actions) => {
                try {
                    console.log({ username, localpart, domains });
                    let domain = domains.shift();
                    await createAccount(username, `${localpart}@${domain}`);
                    for (domain of domains) {
                        try {
                            await createEmail(
                                username,
                                `${localpart}@${domain}`,
                            );
                        } catch {}
                    }
                    reloadAccounts();
                } catch (e) {
                    actions.setErrors({
                        username: "x",
                        localpart: "x",
                    });
                    actions.setStatus(last((e as Error).message.split(":")));
                }
            }}
            validationSchema={object({
                username: string().required(),
                localpart: string().required(),
                domains: array().of(string().required()).min(1),
            })}
        >
            {({ dirty, status, handleChange, values, setFieldValue }) => (
                <Form>
                    <Box className="space-y-2">
                        <FormControl>
                            <FormControl.Label>Username</FormControl.Label>
                            <MoxieTextInput
                                name="username"
                                onKeyDown={(event) => {
                                    const target =
                                        event.target as HTMLInputElement;
                                    setPreviousUsernameValue(target.value);
                                }}
                                onChange={(event) => {
                                    handleChange(event);
                                    if (
                                        values.localpart ===
                                        previousUsernameValue
                                    ) {
                                        setFieldValue(
                                            "localpart",
                                            event.target.value,
                                        );
                                    }
                                }}
                            />
                            {dirty && status && (
                                <FormControl.Validation variant="error">
                                    {status}
                                </FormControl.Validation>
                            )}
                        </FormControl>
                        <Box className="flex gap-3">
                            <FormControl>
                                <FormControl.Label>
                                    Email address
                                </FormControl.Label>
                                <MoxieTextInput name="localpart" block />
                                {dirty && status && (
                                    <FormControl.Validation variant="error">
                                        {status}
                                    </FormControl.Validation>
                                )}
                            </FormControl>
                            <MentionIcon size={16} className="mt-8" />
                            <FormControl>
                                <FormControl.Label>Domain(s)</FormControl.Label>
                                <Box className="pt-1">
                                    <CheckboxGroup>
                                        <CheckboxGroup.Label visuallyHidden>
                                            Domains
                                        </CheckboxGroup.Label>
                                        {domains?.map((domain) => (
                                            <MoxieCheckbox
                                                key={domain.ASCII}
                                                name="domains"
                                                value={domain.ASCII}
                                                label={domain.ASCII}
                                            />
                                        ))}
                                    </CheckboxGroup>
                                </Box>
                            </FormControl>
                        </Box>
                        <ErrorMessage name="domains">
                            {(message) => (
                                <FormControl.Validation variant="error">
                                    {message}
                                </FormControl.Validation>
                            )}
                        </ErrorMessage>
                        <Button type="submit">Add new account</Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
}
