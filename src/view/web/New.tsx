import { Component, Show } from "solid-js";
import {
    boolean,
    enumType,
    literal,
    minLength,
    number,
    object,
    record,
    string,
} from "valibot";
import { Associative } from "~/kit/Associative";
import { Box } from "~/kit/Box";
import { Checkbox } from "~/kit/Checkbox";
import { createForm } from "~/kit/Form";
import { Label } from "~/kit/Label";
import { Segmented } from "~/kit/Segmented";
import { Select } from "~/kit/Select";
import { TextInput } from "~/kit/TextInput";
import { WebHandler, saveHandler, useDomains } from "~/lib/api";

export const New: Component = () => {
    const domains = useDomains();

    const form = createForm(
        object({
            log: string(),
            domain: string(),
            path: string(),
            secure: boolean(),
            compress: boolean(),
            type: enumType(["static", "redirect", "forward"]),
            static: object({
                strip: string(),
                root: string([minLength(1, "required")]),
                list: boolean(),
                continue: boolean(),
                headers: record(string()),
            }),
            redirect: object({
                type: literal("redirect"),
                target: string(),
                sourcePath: string(),
                targetPath: string(),
                status: number(),
            }),
            forward: object({
                type: literal("forward"),
                strip: boolean(),
                url: string(),
                headers: record(string()),
            }),
        }),
        {
            log: "",
            domain: "",
            path: "",
            secure: true,
            compress: false,
            type: "forward",
            static: {
                strip: "",
                root: "",
                list: true,
                continue: false,
                headers: {},
            },
            redirect: {
                type: "redirect",
                target: "",
                sourcePath: "",
                targetPath: "",
                status: 308,
            },
            forward: {
                type: "forward",
                strip: false,
                url: "",
                headers: {},
            },
        },
        async ({ success }) => {
            // console.log("Domain", form.value.domain);
            // console.log(success);
            if (!success) {
                console.log(form.error);
                return;
            }
            const handler: WebHandler = {
                LogName: form.value.log,
                Domain: form.value.domain,
                PathRegexp: `^${form.value.path}`,
                DontRedirectPlainHTTP: !form.value.secure,
                Compress: form.value.compress,
                WebStatic:
                    form.value.type === "static"
                        ? {
                              StripPrefix: form.value.static.strip,
                              Root: form.value.static.root,
                              ListFiles: form.value.static.list,
                              ContinueNotFound: form.value.static.continue,
                              ResponseHeaders: form.value.static.headers,
                          }
                        : null,
                WebRedirect:
                    form.value.type === "redirect"
                        ? {
                              BaseURL: form.value.redirect.target,
                              OrigPathRegexp: form.value.redirect.sourcePath,
                              ReplacePath: form.value.redirect.targetPath,
                              StatusCode: form.value.redirect.status,
                          }
                        : null,
                WebForward:
                    form.value.type === "forward"
                        ? {
                              StripPath: form.value.forward.strip,
                              URL: form.value.forward.url,
                              ResponseHeaders: form.value.forward.headers,
                          }
                        : null,
            };
            const { error } = await saveHandler(handler);
            console.log(error);
        },
    );

    return (
        <form.Form>
            <Box class="py-4 px-4 space-y-4 max-w-md" shaded>
                <TextInput
                    name="name"
                    label="Log name"
                    placeholder="my-log"
                    tip="If blank, the handler index will be used"
                />
                <Select
                    name="domain"
                    label="Domain"
                    options={domains.latest.map((d) => d.ASCII)}
                />
                <TextInput
                    name="path"
                    label="Path regex"
                    placeholder="/path"
                    leadingIcon="chevron-right"
                    tip="Matching regular expression against the start of the request path (implicit ^)"
                />
                <Checkbox
                    name="secure"
                    label="Secure"
                    tip="Redirect HTTP to HTTPS"
                />
                <Checkbox
                    name="compress"
                    label="Compress"
                    tip="Transparently compress responses with gzip where applicable"
                />
            </Box>
            <Segmented
                name="type"
                value={form.value.type}
                onChange={(type) => {
                    form.value.type = type;
                }}
                options={[
                    { value: "static", label: "Static" },
                    { value: "redirect", label: "Redirect" },
                    { value: "forward", label: "Forward" },
                ]}
            />
            <Box
                class="border p-4 space-y-2 rounded max-w-md"
                shaded
                style="min-width: 338px;"
            >
                <Show when={form.value.type === "static"}>
                    <TextInput
                        name="static.strip"
                        label="Strip prefix"
                        placeholder="/prefix"
                        tip="Strip the given prefix from the request path before evaluating local file"
                    />
                    <TextInput
                        name="static.root"
                        label="Root"
                        placeholder="/path/to/root"
                        tip="Path to serve files from, either absolute or relative to the mox working directory"
                    />
                    <Checkbox
                        name="static.list"
                        label="List Files"
                        tip="Display a list of files for directories where index.html is not present"
                    />
                    <Checkbox
                        name="static.continue"
                        label="Continue"
                        tip="If file is not found, continue to next handler instead of returning 404, GET/HEAD only"
                    />
                    <Label label="Additional response headers" />
                    <Associative
                        name="static.headers"
                        keyPlaceholder="Header"
                        valuePlaceholder="Value"
                    />
                </Show>
                <Show when={form.value.type === "redirect"}>
                    <TextInput
                        name="redirect.target"
                        label="Target host:port"
                        placeholder="example.org:2700"
                        tip="Destination hostname/ip and optional port separated by a colon.  May be blank.  If a redirect results in an identical url, the handler doesn't match."
                    />
                    <TextInput
                        name="redirect.sourcePath"
                        label="Path regular expression"
                        placeholder="^/path/([0-9]+)"
                        tip="Regular expression for matching path. If set and path does not match, a 404 is returned. The HTTP path used for matching always starts with a slash."
                    />
                    <TextInput
                        name="redirect.targetPath"
                        label="Regular expression replacement"
                        placeholder="^/newpath/$1"
                        tip="Replacement path for destination URL. Implemented with Go's Regexp.ReplaceAllString: $1 is replaced with the text of the first submatch, etc."
                    />
                    <Select
                        name="redirect.status"
                        label="HTTP Status"
                        tip="Status code to use in redirect"
                        options={[
                            {
                                value: 301,
                                label: "301 - Moved Permanently",
                            },
                            {
                                value: 302,
                                label: "302 - Found",
                            },
                            {
                                value: 303,
                                label: "303 - See Other",
                            },
                            {
                                value: 304,
                                label: "304 - Not Modified",
                            },
                            {
                                value: 307,
                                label: "307 - Temporary Redirect",
                            },
                            {
                                value: 308,
                                label: "308 - Permanent Redirect",
                            },
                        ]}
                    />
                </Show>
                <Show when={form.value.type === "forward"}>
                    <Checkbox
                        name="forward.strip"
                        label="Strip path"
                        tip="Strip the matching handler path before forwarding the request."
                    />
                    <TextInput
                        name="forward.url"
                        label="Destination URL"
                        placeholder="http://127.0.0.1:8888/path"
                        tip="If strip path is false the full request path is added to the URL. Host headers are sent unmodified. New X-Forwarded-{For,Host,Proto} headers are set. Any query string in the URL is ignored. Requests are made using Go's net/http.DefaultTransport that takes environment variables HTTP_PROXY and HTTPS_PROXY into account. Websocket connections are forwarded and data is copied between client and backend without looking at the framing. The websocket 'version' and 'key'/'accept' headers are verified during the handshake, but other websocket headers, including 'origin', 'protocol' and 'extensions' headers, are not inspected and the backend is responsible for verifying/interpreting them."
                    />
                    <Label label="Additional response headers" />
                    <Associative
                        name="static.headers"
                        keyPlaceholder="Header"
                        valuePlaceholder="Value"
                    />
                </Show>
            </Box>
            <button>Add new web handler</button>
        </form.Form>
    );
};
