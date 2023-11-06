import { Component } from "solid-js";
import { custom, object, string } from "valibot";
import { Box } from "~/kit/box";
import { createForm } from "~/kit/form";
import { TextInput } from "~/kit/input";
import { deleteDomain, reloadDomains } from "~/lib/api/admin";

export const Delete: Component<{ domain: string }> = (props) => {
    const form = createForm({
        schema: object({
            domain: string([
                custom((value) => value === props.domain, "incorrect"),
            ]),
        }),
        onSubmit: async ({ success }) => {
            if (success) {
                const { error } = await deleteDomain(form.value.domain);
                if (error) {
                    form.error.domain = error.split(":")[1];
                } else {
                    reloadDomains();
                }
            }
        },
    });

    return (
        <form.Form>
            <TextInput name="domain" label="Confirm domain" />
            <Box variant="danger">
                To delete this domain type the exact name '
                <span class="font-semibold">{props.domain}</span>' above.
            </Box>
            <button>Delete this domain</button>
        </form.Form>
    );
};