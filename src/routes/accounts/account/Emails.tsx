import { PlusIcon, TrashIcon } from "@primer/octicons-react";
import { Box, FormControl, IconButton } from "@primer/react";
import { Form, Formik } from "formik";
import { last } from "rambda";
import { object, string } from "yup";
import { MoxieTextInput } from "~/components/MoxieTextInput";
import { createEmail, deleteEmail, reloadAccount, useAccount } from "~/lib/api";

export function Emails({ username }: { username: string }) {
    const account = useAccount(username);

    return (
        <Box className="flex flex-col gap-2">
            <EmailItem username={username} showCreate />
            {Object.entries(account.Destinations).map(([address]) => (
                <EmailItem
                    key={address}
                    username={username}
                    address={address}
                    showDelete
                />
            ))}
        </Box>
    );
}

function EmailItem({
    username,
    address = "",
    showCreate,
    showDelete,
}: {
    username: string;
    address?: string;
    showCreate?: boolean;
    showDelete?: boolean;
}) {
    const account = useAccount(username);

    return (
        <Formik
            initialValues={{ action: "", address }}
            onSubmit={async ({ action, address }, actions) => {
                try {
                    if (action === "create") {
                        const modifiedAddress = address.includes("@")
                            ? address
                            : `${address}@${account.Domain}`;
                        await createEmail(username, modifiedAddress);
                        actions.resetForm();
                        reloadAccount(username);
                    }
                    if (action === "delete") {
                        await deleteEmail(address);
                        reloadAccount(username);
                    }
                } catch (e) {
                    actions.setErrors({
                        address: "x",
                    });
                    actions.setStatus(last((e as Error).message.split(":")));
                }
            }}
            validationSchema={object({
                action: string(),
                address: string().required(),
            })}
        >
            {({ setFieldValue, submitForm, dirty, status }) => (
                <Form>
                    <FormControl>
                        <FormControl.Label visuallyHidden>
                            Address
                        </FormControl.Label>
                        <div className="flex items-center gap-2 w-full">
                            <MoxieTextInput
                                name="address"
                                placeholder="Address"
                                disabled={!showCreate}
                                className="flex-grow"
                            />
                            <div className="flex gap-1">
                                {showCreate && (
                                    <IconButton
                                        icon={PlusIcon}
                                        aria-label="Create"
                                        onClick={() => {
                                            setFieldValue("action", "create");
                                            submitForm();
                                        }}
                                    />
                                )}
                                {showDelete && !dirty && (
                                    <IconButton
                                        icon={TrashIcon}
                                        aria-label="Delete"
                                        onClick={() => {
                                            setFieldValue("action", "delete");
                                            submitForm();
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                        {dirty && status && (
                            <FormControl.Validation variant="error">
                                {status}
                            </FormControl.Validation>
                        )}
                    </FormControl>
                </Form>
            )}
        </Formik>
    );
}
