import { Component, Show, createSignal, onMount } from "solid-js";
import { minLength, object, string } from "valibot";
import { Box } from "~/kit/box";
import { createForm } from "~/kit/form";
import { TextInput } from "~/kit/input";
import { Select } from "~/kit/select";
import { createAccount, reloadAccounts, useDomains } from "~/lib/api/admin";

export const New: Component = () => {
    const domains = useDomains();

    let usernameInput!: HTMLInputElement;

    const form = createForm({
        schema: object({
            username: string([minLength(1, "required")]),
            localpart: string([minLength(1, "required")]),
            domain: string(),
        }),
        initialValue: {
            username: "",
            localpart: "",
            domain: "",
        },
        onSubmit: async ({ success }) => {
            if (success) {
                const { error } = await createAccount(
                    form.value.username,
                    `${form.value.localpart}@${form.value.domain}`,
                );
                if (error) {
                    form.error.username = error.split(":")[1];
                } else {
                    form.reset();
                    reloadAccounts();
                }
            }
            usernameInput.focus();
        },
    });

    onMount(() => {
        usernameInput.focus();
    });

    const [username, setUsername] = createSignal<string>("");

    function handleUsernameChange(value: string) {
        if (username() === form.value.localpart) {
            form.value.localpart = value;
            form.error.localpart = undefined;
        }
        setUsername(value);
    }

    return (
        <form.Form>
            <TextInput
                name="username"
                label="Username"
                onChange={handleUsernameChange}
                ref={usernameInput}
            />
            <TextInput name="localpart" type="text" label="Localpart" />
            <Select
                name="domain"
                label="Domain"
                options={domains.latest.map((d) => d.ASCII)}
            />
            <Show when={form.value.username && form.value.localpart}>
                <Box variant="attention">
                    The user&nbsp;
                    <span class="font-semibold">{form.value.username}</span>{" "}
                    <br />
                    will be assigned the address
                    <br />
                    <span class="font-semibold">
                        {form.value.localpart}@{form.value.domain}
                    </span>
                </Box>
            </Show>
            <button>Add new account</button>
        </form.Form>
    );
};
