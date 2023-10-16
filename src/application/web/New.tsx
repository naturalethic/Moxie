import { ChevronUpIcon } from "@primer/octicons-react";
import { Box, Button, FormControl } from "@primer/react";
import { Form, Formik } from "formik";
import { last } from "rambda";
import { boolean, object, string } from "yup";
import { MoxieAssociative } from "~/components/MoxieAssociative";
import { MoxieCheckbox } from "~/components/MoxieCheckbox";
import { MoxieSegmentedControl } from "~/components/MoxieSegmentedControl";
import { MoxieSelectControl } from "~/components/MoxieSelectControl";
import { MoxieTextInputControl } from "~/components/MoxieTextInputControl";
import { saveHandler, useDomains } from "~/lib/api";
import { WebHandler } from "~/lib/store";

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
                    headers: {},
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
                    <Box className="space-y-3">
                        {dirty && status && (
                            <FormControl.Validation variant="error">
                                {status}
                            </FormControl.Validation>
                        )}
                        <Box
                            className="border py-4 px-4 space-y-2 rounded max-w-md"
                            bg="neutral.subtle"
                        >
                            <MoxieTextInputControl
                                block
                                name="name"
                                label="Log Name"
                                placeholder="my-log"
                                tip="If blank, the handler index will be used"
                            />
                            <MoxieSelectControl
                                block
                                name="domain"
                                label="Domain"
                                options={domains.map((domain) => domain.ASCII)}
                            />
                            <MoxieTextInputControl
                                block
                                name="path"
                                label="Path Regex"
                                placeholder="/path"
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
                        </Box>
                        {/* <Box
                            className="border py-4 px-4 space-y-2 rounded max-w-md"
                            bg="neutral.subtle"
                        > */}
                        <MoxieSegmentedControl
                            name="type"
                            className="max-w-md"
                            options={[
                                { value: "static", label: "Static" },
                                { value: "forward", label: "Forward" },
                                { value: "redirect", label: "Redirect" },
                            ]}
                        />
                        <Box
                            className="border py-4 px-4 space-y-2 rounded max-w-md"
                            bg="neutral.subtle"
                        >
                            {values.type === "static" && (
                                <>
                                    <MoxieTextInputControl
                                        block
                                        name="details.strip"
                                        label="Strip Prefix"
                                        placeholder="/prefix"
                                        tip="Strip the given prefix from the request path before evaluating local file"
                                    />
                                    <MoxieTextInputControl
                                        block
                                        name="details.root"
                                        label="Root"
                                        placeholder="/path/to/root"
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
                                        keyPlaceholder="X-Moxie"
                                        valuePlaceholder="Value"
                                        items={values.details.headers}
                                    />
                                </>
                            )}
                            {values.type === "forward" && <Box>Forward</Box>}
                            {values.type === "redirect" && <Box>Redirect</Box>}
                        </Box>
                        <Button type="submit" variant="primary">
                            Add new web handler
                        </Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
}
