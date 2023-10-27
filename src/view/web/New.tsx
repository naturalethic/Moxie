import { Component, Show, createSignal } from "solid-js";
import {
    boolean,
    discriminatedUnion,
    literal,
    minLength,
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

type HandlerType = "static" | "forward" | "redirect";

const StaticSchema = object({
    type: literal("static"),
    strip: string(),
    root: string([minLength(1, "required")]),
    list: boolean(),
    continue: boolean(),
    headers: record(string()),
});

const DetailsSchema = discriminatedUnion("type", [
    StaticSchema,
    object({
        type: literal("forward"),
    }),
    object({
        type: literal("redirect"),
    }),
]);

export const New: Component = () => {
    const domains = useDomains();

    const [type, setType] = createSignal<HandlerType>("static");

    const form = createForm(
        object({
            log: string(),
            domain: string(),
            path: string(),
            secure: boolean(),
            compress: boolean(),
            details: DetailsSchema,
        }),
        {
            log: "",
            domain: "",
            path: "",
            secure: true,
            compress: false,
            details: {
                type: "static",
                strip: "",
                root: "",
                list: true,
                continue: false,
                headers: {
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    Pragma: "no-cache",
                    Expires: "0",
                },
            },
        },
        async ({ success }) => {
            console.log("Domain", form.value.domain);
            // console.log(success);
            if (!success) return;
            if (form.value.details.type === "static") {
                const handler: WebHandler = {
                    LogName: form.value.log,
                    Domain: form.value.domain,
                    PathRegexp: `^${form.value.path}`,
                    DontRedirectPlainHTTP: !form.value.secure,
                    Compress: form.value.compress,
                    WebStatic: {
                        StripPrefix: form.value.details.strip,
                        Root: form.value.details.root,
                        ListFiles: form.value.details.list,
                        ContinueNotFound: form.value.details.continue,
                        ResponseHeaders: form.value.details.headers,
                    },
                    WebForward: null,
                    WebRedirect: null,
                };
                const { error } = await saveHandler(handler);
                console.log(error);
            }
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
                value={type()}
                onChange={(type) => setType(type)}
                options={[
                    { value: "static", label: "Static" },
                    { value: "forward", label: "Forward" },
                    { value: "redirect", label: "Redirect" },
                ]}
            />
            <Box
                class="border p-4 space-y-2 rounded max-w-md"
                shaded
                style="min-width: 338px;"
            >
                <Show when={type() === "static"}>
                    <TextInput
                        name="details.strip"
                        label="Strip prefix"
                        placeholder="/prefix"
                        tip="Strip the given prefix from the request path before evaluating local file"
                    />
                    <TextInput
                        name="details.root"
                        label="Root"
                        placeholder="/path/to/root"
                        tip="Path to serve files from, either absolute or relative to the mox working directory"
                    />
                    <Checkbox
                        name="details.list"
                        label="List Files"
                        tip="Display a list of files for directories where index.html is not present"
                    />
                    <Checkbox
                        name="details.continue"
                        label="Continue"
                        tip="If file is not found, continue to next handler instead of returning 404, GET/HEAD only"
                    />
                    <Label label="Additional response headers" />
                    <Associative
                        name="details.headers"
                        keyPlaceholder="Header"
                        valuePlaceholder="Value"
                    />
                </Show>
                <Show when={type() === "forward"}>
                    <div>Forward</div>
                </Show>
                <Show when={type() === "redirect"}>
                    <div>Redirect</div>
                </Show>
            </Box>
            <button>Add new web handler</button>
        </form.Form>
    );
};
