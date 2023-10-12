import { AlertFillIcon, CheckCircleIcon } from "@primer/octicons-react";
import { Box, Button, Flash, FormControl, IconButton } from "@primer/react";
import { zxcvbn } from "@zxcvbn-ts/core";
import { Form, Formik } from "formik";
import { last } from "rambda";
import { useState } from "react";
import { randomPassword } from "secure-random-password";
import { object, string } from "yup";
import { MoxieTextInput } from "~/components/MoxieTextInput";
import { setPassword } from "~/lib/api";

export function Password({
    username,
}: {
    username: string;
}) {
    const [complexity, setComplexity] = useState(-1);

    function checkComplexity(value: string) {
        if (value.length === 0) {
            setComplexity(-1);
            return;
        }
        setComplexity(zxcvbn(value).score);
    }

    return (
        <Formik
            initialValues={{ action: "", password: "" }}
            onSubmit={async ({ action, password }, actions) => {
                try {
                    if (action === "update") {
                        await setPassword(username, password);
                        actions.resetForm();
                        checkComplexity("");
                    }
                } catch (e) {
                    actions.setErrors({
                        password: "x",
                    });
                    actions.setStatus(last((e as Error).message.split(":")));
                }
            }}
            validationSchema={object({
                action: string(),
                password: string().required(),
            })}
        >
            {({ setFieldValue, submitForm, dirty, status, handleChange }) => (
                <Form>
                    <FormControl>
                        <FormControl.Label visuallyHidden>
                            Password
                        </FormControl.Label>
                        <div className="space-y-2 w-full">
                            <Flash variant="warning">
                                <Box
                                    className="text-xs flex items-center gap-2"
                                    bg="attention.subtle"
                                    sx={{ color: "attention.emphasis" }}
                                >
                                    <AlertFillIcon size={24} />
                                    <div>
                                        Bots will try to bruteforce your
                                        password. Connections with failed
                                        authentication attempts will be rate
                                        limited but attackers WILL find weak
                                        passwords. If your account is
                                        compromised, spammers are likely to
                                        abuse your system, spamming your address
                                        and the wider internet in your name. So
                                        please pick a random, unguessable
                                        password, preferrably at least 12
                                        characters.
                                    </div>
                                </Box>
                            </Flash>

                            <div className="flex items-center gap-2 w-full">
                                <MoxieTextInput
                                    name="password"
                                    placeholder="Password"
                                    className="flex-grow"
                                    onChange={(event) => {
                                        handleChange(event);
                                        checkComplexity(event.target.value);
                                    }}
                                />
                                <div className="flex gap-1">
                                    <IconButton
                                        icon={CheckCircleIcon}
                                        aria-label="Update"
                                        onClick={() => {
                                            setFieldValue("action", "update");
                                            submitForm();
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="w-full">
                                <PasswordBar complexity={complexity} />
                            </div>
                            <div>
                                <Button
                                    onClick={() => {
                                        const password = randomPassword();
                                        setFieldValue("password", password);
                                        checkComplexity(password);
                                    }}
                                >
                                    Generate Password
                                </Button>
                            </div>
                            {dirty && status && (
                                <FormControl.Validation variant="error">
                                    {status}
                                </FormControl.Validation>
                            )}
                        </div>
                    </FormControl>
                </Form>
            )}
        </Formik>
    );
}

function PasswordBar({ complexity }: { complexity: number }) {
    return (
        <div className="flex gap-1 w-full">
            <Box
                sx={{
                    backgroundColor:
                        complexity >= 0 ? "danger.emphasis" : "danger.subtle",
                }}
                className="h-2 rounded-full w-[5%]"
            />
            <Box
                sx={{
                    backgroundColor:
                        complexity >= 1 ? "severe.emphasis" : "severe.subtle",
                }}
                className="h-2 rounded-full w-[10%]"
            />
            <Box
                sx={{
                    backgroundColor:
                        complexity >= 2
                            ? "attention.emphasis"
                            : "attention.subtle",
                }}
                className="h-2 rounded-full w-[15%]"
            />
            <Box
                sx={{
                    backgroundColor:
                        complexity >= 3 ? "accent.emphasis" : "accent.subtle",
                }}
                className="h-2 rounded-full w-[26%]"
            />
            <Box
                sx={{
                    backgroundColor:
                        complexity >= 4 ? "success.emphasis" : "success.subtle",
                }}
                className="h-2 rounded-full w-[44%]"
            />
        </div>
    );
}

// 8 5 3 2 1
