import { ChevronUpIcon } from "@primer/octicons-react";
import { Box, Button, FormControl } from "@primer/react";
import { Form, Formik } from "formik";
import { last } from "rambda";
import { boolean, object, string } from "yup";
import { MoxieAssociative } from "~/components/MoxieAssociative";
import { MoxieCheckbox } from "~/components/MoxieCheckbox";
import { MoxieRadioGroup } from "~/components/MoxieRadioGroup";
import { MoxieSelectControl } from "~/components/MoxieSelectControl";
import { MoxieTextInputControl } from "~/components/MoxieTextInputControl";
import { saveHandler, useDomains } from "~/lib/api";
import { WebHandler } from "~/lib/store";

// StripPrefix: string;
// Root: string;
// ListFiles: boolean;
// ContinueNotFound: boolean;
// ResponseHeaders: Record<string, string> | null;

export function New() {
    const domains = useDomains();

    return (
        <Formik
            initialValues={{
                log: "",
                domain: domains[0].ASCII,
                path: "",
                secure: true,
                compress: false,
                type: "static",
                details: {
                    strip: "",
                    root: "",
                    list: true,
                    continue: false,
                    headers: { foo: "bar" },
                },
            }}
            onSubmit={async (
                { log, domain, path, secure, compress, details },
                actions,
            ) => {
                try {
                    const handler: WebHandler = {
                        LogName: log,
                        Domain: domain,
                        PathRegexp: `^${path}`,
                        DontRedirectPlainHTTP: !secure,
                        Compress: compress,
                        WebStatic: {
                            StripPrefix: details.strip,
                            Root: details.root,
                            ListFiles: details.list,
                            ContinueNotFound: details.continue,
                            ResponseHeaders: details.headers,
                        },
                        WebRedirect: null,
                        WebForward: null,
                    };
                    console.log(handler);
                    saveHandler(handler);
                    // reloadWebServerConfig();
                    actions.resetForm();
                } catch (e) {
                    actions.setErrors({});
                    actions.setStatus(last((e as Error).message.split(":")));
                }
            }}
            validationSchema={object({
                log: string(),
                domain: string().required(),
                path: string(),
                secure: boolean(),
                compress: boolean(),
                type: string().required(),
            })}
        >
            {({ dirty, status, values }) => (
                <Form>
                    <Box className="space-y-2">
                        {dirty && status && (
                            <FormControl.Validation variant="error">
                                {status}
                            </FormControl.Validation>
                        )}
                        <MoxieTextInputControl
                            name="name"
                            label="Log Name"
                            tip="If blank, the handler index will be used"
                        />
                        <MoxieSelectControl
                            name="domain"
                            label="Domain"
                            options={domains.map((domain) => domain.ASCII)}
                        />
                        <MoxieTextInputControl
                            name="path"
                            label="Path Regex"
                            leadingVisual={ChevronUpIcon}
                            tip="Matching regular expression against the start of the request path (implicit ^)"
                        />
                        <MoxieCheckbox
                            name="secure"
                            label="Secure"
                            tip="Redirect HTTP to HTTPS"
                        />
                        <MoxieCheckbox
                            name="compress"
                            label="Compress"
                            tip="Transparently compress responses with gzip where applicable."
                        />
                        <hr />
                        <MoxieRadioGroup
                            name="type"
                            label="Type"
                            options={["static", "forward", "redirect"]}
                        />
                        {values.type === "static" && (
                            <Box className="space-y-2">
                                <MoxieTextInputControl
                                    name="details.strip"
                                    label="Strip Prefix"
                                    tip="Strip the given prefix from the request path before evaluating local file"
                                />
                                <MoxieTextInputControl
                                    name="details.root"
                                    label="Root"
                                    tip="Path to serve files from, either absolute or relative to the mox working directory"
                                />
                                <MoxieCheckbox
                                    name="details.list"
                                    label="List Files"
                                    tip="Display a list of files for directories where index.html is not present"
                                />
                                <MoxieCheckbox
                                    name="details.continue"
                                    label="Continue"
                                    tip="If file is not found, continue to next handler instead of returning 404, GET/HEAD only"
                                />
                                <MoxieAssociative
                                    label="Additional response headers"
                                    name="details.headers"
                                    keyLabel="Header"
                                    valueLabel="Value"
                                    items={values.details.headers}
                                />
                            </Box>
                        )}
                        {values.type === "forward" && <Box>Forward</Box>}
                        {values.type === "redirect" && <Box>Redirect</Box>}
                        <hr />
                        <Button type="submit" variant="primary">
                            Add new web handler
                        </Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
}
