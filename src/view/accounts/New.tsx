import { Component, Show, createSignal, onMount } from "solid-js";
import { minLength, object, string } from "valibot";
import { Box } from "~/kit/Box";
import { createForm } from "~/kit/Form";
import { Select } from "~/kit/Select";
import { TextInput } from "~/kit/TextInput";
import { createAccount, reloadAccounts, useDomains } from "~/lib/api";

export const New: Component = () => {
    const domains = useDomains();

    let usernameInput!: HTMLInputElement;

    const { form, setForm, Form, setError } = createForm(
        object({
            username: string([minLength(1, "required")]),
            localpart: string([minLength(1, "required")]),
            domain: string(),
        }),
        async ({ success }) => {
            if (success) {
                const { error } = await createAccount(
                    form.username,
                    `${form.localpart}@${form.domain}`,
                );
                if (error) {
                    setError("username", error.split(":")[1]);
                } else {
                    // XXX: calling this causes this component to be re-created
                    reloadAccounts();
                }
            }
        },
    );

    onMount(() => {
        // XXX: Since the component is re-created as mentioned above, need to
        //      call focus here.
        usernameInput.focus();
    });

    const [username, setUsername] = createSignal<string>("");

    function handleUsernameChange(value: string) {
        if (username() === form.localpart) {
            setForm("localpart", value);
            setError("localpart", undefined);
        }
        setUsername(value);
    }

    return (
        <Form>
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
            <Show when={form.username && form.localpart}>
                <Box variant="attention">
                    The user&nbsp;
                    <span class="font-semibold">{form.username}</span> <br />
                    will be assigned the address
                    <br />
                    <span class="font-semibold">
                        {form.localpart}@{form.domain}
                    </span>
                </Box>
            </Show>
            <button>Add new account</button>
        </Form>
    );
};
