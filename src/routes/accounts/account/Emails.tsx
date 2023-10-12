import { MentionIcon, PlusIcon, TrashIcon } from "@primer/octicons-react";
import { Box, FormControl, IconButton, Select } from "@primer/react";
import { Form, Formik } from "formik";
import { last } from "rambda";
import { object, string } from "yup";
import { MoxieSelect } from "~/components/MoxieSelect";
import { MoxieTextInput } from "~/components/MoxieTextInput";
import {
    createEmail,
    deleteEmail,
    reloadAccount,
    useAccount,
    useDomains,
} from "~/lib/api";

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
    const domains = useDomains();

    return (
        <Formik
            initialValues={{
                action: "",
                localpart: address ? address.split("@")[0] : "",
                domain: address ? address.split("@")[1] : domains[0].ASCII,
            }}
            onSubmit={async ({ action, localpart, domain }, actions) => {
                try {
                    if (action === "create") {
                        await createEmail(username, `${localpart}@${domain}`);
                        actions.resetForm();
                        reloadAccount(username);
                    }
                    if (action === "delete") {
                        await deleteEmail(`${localpart}@${domain}`);
                        reloadAccount(username);
                    }
                } catch (e) {
                    actions.setErrors({
                        localpart: "x",
                    });
                    actions.setStatus(last((e as Error).message.split(":")));
                }
            }}
            validationSchema={object({
                action: string(),
                localpart: string().required(),
                domain: string().required(),
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
                                name="localpart"
                                placeholder="Local part"
                                disabled={!showCreate}
                                block
                            />
                            <MentionIcon size={12} />
                            <MoxieSelect
                                block
                                name="domain"
                                disabled={!showCreate}
                            >
                                {domains?.map((domain) => (
                                    <Select.Option
                                        key={domain.ASCII}
                                        value={domain.ASCII}
                                    >
                                        {domain.ASCII}
                                    </Select.Option>
                                ))}
                            </MoxieSelect>
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
                                {showDelete && (
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
