import {
    ArrowRightIcon,
    CheckCircleIcon,
    CircleSlashIcon,
    PlusIcon,
    TrashIcon,
} from "@primer/octicons-react";
import { Box, IconButton, Text } from "@primer/react";
import { Form, Formik } from "formik";
import { last } from "rambda";
import { object, string } from "yup";
import { MoxieTextInput } from "~/components/MoxieTextInput";
import {
    reloadWebServerConfig,
    saveRedirect,
    useWebServerConfig,
} from "~/lib/api";

export function Redirects() {
    const webServerConfig = useWebServerConfig();

    return (
        <Box className="flex flex-col gap-2 pt-2">
            <RedirectItem showCreate />
            {webServerConfig?.WebDNSDomainRedirects?.map(([from, to]) => (
                <RedirectItem
                    key={from.ASCII}
                    from={from.ASCII}
                    to={to.ASCII}
                    showDelete
                />
            ))}
        </Box>
    );
}

function RedirectItem({
    from = "",
    to = "",
    showCreate,
    showDelete,
}: {
    from?: string;
    to?: string;
    showCreate?: boolean;
    showDelete?: boolean;
}) {
    return (
        <Formik
            initialValues={{ action: "", from, to }}
            onSubmit={async ({ action, from, to }, actions) => {
                try {
                    if (action === "create") {
                        await saveRedirect({ from, to });
                        actions.resetForm();
                        reloadWebServerConfig();
                    }
                    if (action === "update") {
                        await saveRedirect({ from, to });
                        actions.resetForm({ values: { action: "", from, to } });
                        reloadWebServerConfig();
                    }
                    if (action === "delete") {
                        await saveRedirect({ from });
                        reloadWebServerConfig();
                    }
                } catch (e) {
                    actions.setErrors({
                        from: "x",
                        to: "x",
                    });
                    actions.setStatus(last((e as Error).message.split(":")));
                }
            }}
            validationSchema={object({
                action: string(),
                from: string().required(),
                to: string().required(),
            })}
        >
            {({ setFieldValue, submitForm, dirty, resetForm, status }) => (
                <Form className="flex items-center gap-2">
                    <MoxieTextInput
                        name="from"
                        placeholder="From"
                        disabled={!showCreate}
                    />
                    <ArrowRightIcon size={16} />
                    <MoxieTextInput name="to" placeholder="To" />
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
                        {!showCreate && dirty && (
                            <>
                                <IconButton
                                    icon={CircleSlashIcon}
                                    aria-label="Reset"
                                    onClick={() => resetForm()}
                                />
                                <IconButton
                                    icon={CheckCircleIcon}
                                    aria-label="Update"
                                    onClick={() => {
                                        setFieldValue("action", "update");
                                        submitForm();
                                    }}
                                />
                            </>
                        )}
                    </div>
                    {dirty && status && (
                        <Text sx={{ color: "danger.fg" }}>{status}</Text>
                    )}
                </Form>
            )}
        </Formik>
    );
}
