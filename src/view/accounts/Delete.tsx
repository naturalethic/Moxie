import { Component } from "solid-js";
import { custom, object, string } from "valibot";
import { Box } from "~/kit/Box";
import { createForm } from "~/kit/Form";
import { TextInput } from "~/kit/TextInput";
import { deleteAccount, reloadAccounts } from "~/lib/api";

export const Delete: Component<{ username: string }> = (props) => {
    const { form, Form, setError } = createForm(
        object({
            username: string([
                custom((value) => value === props.username, "incorrect"),
            ]),
        }),
        async ({ success }) => {
            if (success) {
                const { error } = await deleteAccount(form.username);
                if (error) {
                    setError("username", error.split(":")[1]);
                } else {
                    reloadAccounts();
                }
            }
        },
    );

    return (
        <Form>
            <TextInput name="username" label="Confirm username" />
            <Box variant="danger">
                To delete this account type the exact username '
                <span class="font-semibold">{props.username}</span>' above.
            </Box>
            <button>Delete this account</button>
        </Form>
    );
};
