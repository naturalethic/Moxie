import { Component, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { minLength, object, string } from "valibot";
import { Box } from "~/kit/Box";
import { createForm } from "~/kit/Form";
import { Select } from "~/kit/Select";
import { TextInput } from "~/kit/TextInput";
import { createAccount, reloadAccounts, useDomains } from "~/lib/api";

export const New: Component = () => {
    const domains = useDomains();

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
                    reloadAccounts();
                }
            }
        },
    );

    const [state, setState] = createStore({
        username: "",
    });

    function handleUsernameChange(value: string) {
        if (state.username === form.localpart) {
            setForm("localpart", value);
            setError("localpart", undefined);
        }
        setState("username", value);
    }

    return (
        <Form>
            <TextInput
                name="username"
                type="text"
                label="Username"
                onChange={handleUsernameChange}
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
