import { Component, Show } from "solid-js";
import { boolean, object, record, string } from "valibot";
import { Associative } from "~/kit/Associative";
import { Box } from "~/kit/Box";
import { Checkbox } from "~/kit/Checkbox";
import { createForm } from "~/kit/Form";
import { Segmented } from "~/kit/Segmented";
import { Select } from "~/kit/Select";
import { TextInput } from "~/kit/TextInput";
import { useDomains } from "~/lib/api";

export const New: Component = () => {
    const domains = useDomains();

    const { form, setForm, Form } = createForm(
        object({
            log: string(),
            domain: string(),
            path: string(),
            secure: boolean(),
            compress: boolean(),
            type: string(),
            details: object({
                strip: string(),
                root: string(),
                list: boolean(),
                continue: boolean(),
                headers: record(string()),
            }),
        }),
        {
            log: "",
            domain: "",
            path: "",
            secure: true,
            compress: false,
            type: "static",
            details: {
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
        ({ success }) => {
            console.log(success);
        },
    );
    console.log("New", form.details.headers);
    return (
        <Form>
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
                defaultValue={form.type}
                onChange={(type) => setForm("type", type)}
                options={[
                    { value: "static", label: "Static" },
                    { value: "forward", label: "Forward" },
                    { value: "redirect", label: "Redirect" },
                ]}
            />
            <Box class="border py-4 px-4 space-y-2 rounded max-w-md bg-subtle">
                <Show when={form.type === "static"}>
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
                    <Associative
                        // label="Additional response headers"
                        // name="details.headers"
                        // keyLabel="Header"
                        // valueLabel="Value"
                        keyPlaceholder="X-Moxie"
                        valuePlaceholder="Value"
                        items={form.details.headers}
                    />
                </Show>
                <Show when={form.type === "forward"}>
                    <div>Forward</div>
                </Show>
                <Show when={form.type === "redirect"}>
                    <div>Redirect</div>
                </Show>
            </Box>
            <button>Add new web handler</button>
        </Form>
    );
};
