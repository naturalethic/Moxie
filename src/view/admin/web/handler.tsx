import { Component, Show } from "solid-js";
import { Associative } from "~/kit/associative";
import { Box } from "~/kit/box";
import { Checkbox } from "~/kit/checkbox";
import { createForm } from "~/kit/form";
import { TextInput } from "~/kit/input";
import { Label } from "~/kit/label";
import { Segmented } from "~/kit/segmented";
import { Select } from "~/kit/select";
import { useToast } from "~/kit/toast";
import {
    WebHandler,
    createHandler,
    updateHandler,
    useDomains,
    useWebServerConfig,
} from "~/lib/api/admin";
import {
    Infer,
    boolean,
    discriminated,
    literal,
    number,
    object,
    record,
    string,
} from "~/lib/schema";
import { required } from "~/lib/validation";

const StaticDetail = object({
    type: literal("static"),
    strip: string(),
    root: string([required()]),
    list: boolean(),
    continue: boolean(),
    headers: record(string()),
});

const RedirectDetail = object({
    type: literal("redirect"),
    target: string(),
    sourcePath: string(),
    targetPath: string(),
    status: number(),
});

const ForwardDetail = object({
    type: literal("forward"),
    strip: boolean(),
    url: string(),
    headers: record(string()),
});

export const Handler: Component<{ index?: number }> = (props) => {
    const toast = useToast();
    const domains = useDomains();
    const handler =
        props.index === undefined
            ? undefined
            : useWebServerConfig()?.latest?.WebHandlers?.[props.index]!;

    const staticDetail: Infer<typeof StaticDetail> = handler?.WebStatic
        ? {
              type: "static",
              strip: handler.WebStatic.StripPrefix,
              root: handler.WebStatic.Root,
              list: handler.WebStatic.ListFiles,
              continue: handler.WebStatic.ContinueNotFound,
              headers: handler.WebStatic.ResponseHeaders ?? {},
          }
        : {
              type: "static",
              strip: "",
              root: "",
              list: true,
              continue: false,
              headers: {},
          };

    const redirectDetail: Infer<typeof RedirectDetail> = handler?.WebRedirect
        ? {
              type: "redirect",
              target: handler.WebRedirect.BaseURL,
              sourcePath: handler.WebRedirect.OrigPathRegexp,
              targetPath: handler.WebRedirect.ReplacePath,
              status: handler.WebRedirect.StatusCode,
          }
        : {
              type: "redirect",
              target: "",
              sourcePath: "",
              targetPath: "",
              status: 308,
          };

    const forwardDetail: Infer<typeof ForwardDetail> = handler?.WebForward
        ? {
              type: "forward",
              strip: handler.WebForward.StripPath,
              url: handler.WebForward.URL,
              headers: handler.WebForward.ResponseHeaders ?? {},
          }
        : {
              type: "forward",
              strip: false,
              url: "",
              headers: {},
          };

    const form = createForm({
        schema: object({
            log: string(),
            domain: string(),
            path: string(),
            secure: boolean(),
            compress: boolean(),
            detail: discriminated("type", [
                StaticDetail,
                RedirectDetail,
                ForwardDetail,
            ]),
        }),
        prototype: {
            log: handler?.LogName ?? "",
            domain: handler?.Domain ?? "",
            path: handler?.PathRegexp.substring(1) ?? "",
            secure: !handler?.DontRedirectPlainHTTP ?? true,
            compress: handler?.Compress ?? false,
            detail:
                !handler || handler.WebStatic
                    ? staticDetail
                    : handler.WebRedirect
                    ? redirectDetail
                    : forwardDetail,
        },
        onSubmit: async ({ success }) => {
            if (!success) {
                console.log(form.error);
                return;
            }
            const payload: WebHandler = {
                LogName: form.value.log,
                Domain: form.value.domain,
                PathRegexp: `^${form.value.path}`,
                DontRedirectPlainHTTP: !form.value.secure,
                Compress: form.value.compress,
                WebStatic:
                    form.value.detail.type === "static"
                        ? {
                              StripPrefix: form.value.detail.strip,
                              Root: form.value.detail.root,
                              ListFiles: form.value.detail.list,
                              ContinueNotFound: form.value.detail.continue,
                              ResponseHeaders: form.value.detail.headers,
                          }
                        : null,
                WebRedirect:
                    form.value.detail.type === "redirect"
                        ? {
                              BaseURL: form.value.detail.target,
                              OrigPathRegexp: form.value.detail.sourcePath,
                              ReplacePath: form.value.detail.targetPath,
                              StatusCode: form.value.detail.status,
                          }
                        : null,
                WebForward:
                    form.value.detail.type === "forward"
                        ? {
                              StripPath: form.value.detail.strip,
                              URL: form.value.detail.url,
                              ResponseHeaders: form.value.detail.headers,
                          }
                        : null,
            };
            const { error } = handler
                ? await updateHandler(props.index!, payload)
                : await createHandler(payload);
            if (error) {
                toast("danger", error);
            } else {
                toast(
                    "success",
                    handler ? "Web handler updated" : "Web handler created",
                );
            }
        },
    });

    function handleChangeType(type: "static" | "redirect" | "forward") {
        form.value.detail =
            type === "static"
                ? staticDetail
                : type === "redirect"
                ? redirectDetail
                : forwardDetail;
    }

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
                value={form.value.detail.type}
                onChange={handleChangeType}
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
                <Show when={form.value.detail.type === "static"}>
                    <TextInput
                        name="detail.strip"
                        label="Strip prefix"
                        placeholder="/prefix"
                        tip="Strip the given prefix from the request path before evaluating local file"
                    />
                    <TextInput
                        name="detail.root"
                        label="Root"
                        placeholder="/path/to/root"
                        tip="Path to serve files from, either absolute or relative to the mox working directory"
                    />
                    <Checkbox
                        name="detail.list"
                        label="List Files"
                        tip="Display a list of files for directories where index.html is not present"
                    />
                    <Checkbox
                        name="detail.continue"
                        label="Continue"
                        tip="If file is not found, continue to next handler instead of returning 404, GET/HEAD only"
                    />
                    <Label label="Additional response headers" />
                    <Associative
                        name="detail.headers"
                        keyPlaceholder="Header"
                        valuePlaceholder="Value"
                    />
                </Show>
                <Show when={form.value.detail.type === "redirect"}>
                    <TextInput
                        name="detail.target"
                        label="Target host:port"
                        placeholder="example.org:2700"
                        tip="Destination hostname/ip and optional port separated by a colon.  May be blank.  If a redirect results in an identical url, the handler doesn't match."
                    />
                    <TextInput
                        name="detail.sourcePath"
                        label="Path regular expression"
                        placeholder="^/path/([0-9]+)"
                        tip="Regular expression for matching path. If set and path does not match, a 404 is returned. The HTTP path used for matching always starts with a slash."
                    />
                    <TextInput
                        name="detail.targetPath"
                        label="Regular expression replacement"
                        placeholder="^/newpath/$1"
                        tip="Replacement path for destination URL. Implemented with Go's Regexp.ReplaceAllString: $1 is replaced with the text of the first submatch, etc."
                    />
                    <Select
                        name="detail.status"
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
                <Show when={form.value.detail.type === "forward"}>
                    <Checkbox
                        name="detail.strip"
                        label="Strip path"
                        tip="Strip the matching handler path before forwarding the request."
                    />
                    <TextInput
                        name="detail.url"
                        label="Destination URL"
                        placeholder="http://127.0.0.1:8888/path"
                        tip="If strip path is false the full request path is added to the URL. Host headers are sent unmodified. New X-Forwarded-{For,Host,Proto} headers are set. Any query string in the URL is ignored. Requests are made using Go's net/http.DefaultTransport that takes environment variables HTTP_PROXY and HTTPS_PROXY into account. Websocket connections are forwarded and data is copied between client and backend without looking at the framing. The websocket 'version' and 'key'/'accept' headers are verified during the handshake, but other websocket headers, including 'origin', 'protocol' and 'extensions' headers, are not inspected and the backend is responsible for verifying/interpreting them."
                    />
                    <Label label="Additional response headers" />
                    <Associative
                        name="detail.headers"
                        keyPlaceholder="Header"
                        valuePlaceholder="Value"
                    />
                </Show>
            </Box>
            <button>
                {handler ? "Update web handler" : "Add new web handler"}
            </button>
        </form.Form>
    );
};
