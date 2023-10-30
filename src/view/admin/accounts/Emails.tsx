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

    const form = createForm(
        object({
            localpart: string(),
            domain: string(),
        }),
        async () => {
            const { error } = await createEmail(
                props.username,
                `${form.value.localpart}@${form.value.domain}`,
            );
            if (error) {
                form.message = error.split(":")[1];
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
            <form.Form>
                <Box shaded class="flex flex-col p-2 space-y-1">
                    <div class="flex gap-1">
                        <TextInput
                            size="small"
                            name="localpart"
                            placeholder="localpart"
                        />
                        <Select
                            size="small"
                            name="domain"
                            options={domains.latest.map((d) => d.ASCII)}
                        />
                    </div>
                    <Show when={form.message}>
                        <Box variant="danger">{form.message}</Box>
                    </Show>
                    <button class="text-xs">Add email address</button>
                </Box>
            </form.Form>
            <List
                size="small"
                items={Object.keys(account.latest?.Destinations ?? {})}
                onDelete={handleDelete}
            />
        </Box>
    );
};