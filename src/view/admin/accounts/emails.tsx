import { Component, Show, onMount } from "solid-js";
import { Box } from "~/kit/box";
import { List } from "~/kit/list";
import { Select } from "~/kit/select";
import { TextInput } from "~/kit/text-input";
import {
    createEmail,
    deleteEmail,
    reloadAccount,
    useAccount,
    useDomains,
} from "~/lib/api/admin";
import { createForm } from "~/lib/form";
import { object, string } from "~/lib/schema";

export const Emails: Component<{ username: string }> = (props) => {
    const domains = useDomains();
    const account = useAccount(props.username);

    const form = createForm({
        schema: object({
            localpart: string(),
            domain: string(),
        }),
        prototype: {
            localpart: "",
            domain: "",
        },
        onSubmit: async () => {
            const { error } = await createEmail(
                props.username,
                `${form.value.localpart}@${form.value.domain}`,
            );
            if (error) {
                form.message = error.split(":")[1];
            } else {
                reloadAccount(props.username);
                localpartInput.value = "";
                localpartInput.focus();
            }
        },
    });

    async function handleDelete(address: string) {
        await deleteEmail(address);
        reloadAccount(props.username);
    }

    let localpartInput: HTMLInputElement;

    onMount(() => {
        localpartInput.focus();
    });

    return (
        <Box class="space-y-2">
            <form.Form>
                <Box shaded class="flex flex-col p-2 space-y-1">
                    <div class="flex gap-1">
                        <TextInput
                            ref={localpartInput!}
                            small
                            name="localpart"
                            placeholder="localpart"
                        />
                        <Select
                            small
                            name="domain"
                            items={domains.latest.map((d) => d.ASCII)}
                        />
                    </div>
                    <Show when={form.message}>
                        <Box variant="danger">{form.message}</Box>
                    </Show>
                    <button class="text-xs">Add email address</button>
                </Box>
            </form.Form>
            <List
                small
                items={Object.keys(account.latest?.Destinations ?? {})}
                onDelete={handleDelete}
            />
        </Box>
    );
};
