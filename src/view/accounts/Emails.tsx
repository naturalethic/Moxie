import { Component, Show } from "solid-js";
import { object, string } from "valibot";
import { Box } from "~/kit/Box";
import { createForm } from "~/kit/Form";
import { List } from "~/kit/List";
import { Select } from "~/kit/Select";
import { TextInput } from "~/kit/TextInput";
import {
    createEmail,
    deleteEmail,
    reloadAccount,
    useAccount,
    useDomains,
} from "~/lib/api";

export const Emails: Component<{ username: string }> = (props) => {
    const domains = useDomains();
    const account = useAccount(props.username);

    const { form, Form, message, setMessage } = createForm(
        object({
            localpart: string(),
            domain: string(),
        }),
        async () => {
            const { error } = await createEmail(
                props.username,
                `${form.localpart}@${form.domain}`,
            );
            if (error) {
                setMessage(error.split(":")[1]);
            } else {
                reloadAccount(props.username);
            }
        },
    );

    async function handleDelete(address: string) {
        await deleteEmail(address);
        reloadAccount(props.username);
    }

    return (
        <Box class="space-y-2">
            <Form>
                <Box shaded class="p-2 space-y-2">
                    <div class="flex gap-1">
                        <TextInput
                            name="localpart"
                            placeholder="localpart"
                            label="Localpart"
                        />
                        <Select
                            name="domain"
                            label="Domain"
                            options={domains.latest.map((d) => d.ASCII)}
                        />
                    </div>
                    <Show when={message()}>
                        <Box variant="danger">{message()}</Box>
                    </Show>
                </Box>
                <button>Add email address</button>
            </Form>
            <List
                items={Object.keys(account.latest?.Destinations ?? {})}
                onDelete={handleDelete}
            />
        </Box>
    );
};
