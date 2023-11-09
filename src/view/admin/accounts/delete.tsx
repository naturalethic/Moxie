import { Component } from "solid-js";
import { Box } from "~/kit/box";
import { createForm } from "~/kit/form";
import { TextInput } from "~/kit/text-input";
import { deleteAccount, reloadAccounts } from "~/lib/api/admin";
import { object, string } from "~/lib/schema";

export const Delete: Component<{ username: string }> = (props) => {
    const form = createForm({
        schema: object({
            username: string([
                (value: string) => {
                    if (value !== props.username) return "Incorrect";
                },
            ]),
        }),
        prototype: {
            username: "",
        },
        onSubmit: async ({ success }) => {
            if (success) {
                const { error } = await deleteAccount(form.value.username!);
                if (error) {
                    form.error.username = error.split(":")[1];
                } else {
                    reloadAccounts();
                }
            }
        },
    });

    return (
        <form.Form>
            <TextInput name="username" label="Confirm username" />
            <Box variant="danger">
                To delete this account type the exact username '
                <span class="font-semibold">{props.username}</span>' above.
            </Box>
            <button>Delete this account</button>
        </form.Form>
    );
};
