import { Component } from "solid-js";
import { custom, object, string } from "valibot";
import { Box } from "~/kit/box";
import { createForm } from "~/kit/form";
import { TextInput } from "~/kit/input";
import { deleteAccount, reloadAccounts } from "~/lib/api";

export const Delete: Component<{ username: string }> = (props) => {
    const form = createForm(
        object({
            username: string([
                custom((value) => value === props.username, "incorrect"),
            ]),
        }),
        async ({ success }) => {
            if (success) {
                const { error } = await deleteAccount(form.value.username);
                if (error) {
                    form.error.username = error.split(":")[1];
                } else {
                    reloadAccounts();
                }
            }
        },
    );

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
