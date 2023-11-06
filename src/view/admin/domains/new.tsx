import { Component, onMount } from "solid-js";
import { minLength, object, string } from "valibot";
import { createForm } from "~/kit/form";
import { TextInput } from "~/kit/input";
import { Select } from "~/kit/select";
import { createDomain, reloadDomains, useAccounts } from "~/lib/api/admin";

export const New: Component = () => {
    const accounts = useAccounts();

    let domainInput!: HTMLInputElement;

    const form = createForm({
        schema: object({
            domain: string([minLength(1, "required")]),
            username: string(),
        }),
        initialValue: {
            domain: "",
        },
        onSubmit: async ({ success }) => {
            if (success) {
                const { error } = await createDomain(
                    form.value.domain,
                    form.value.username,
                );
                if (error) {
                    form.error.username = error.split(":")[1];
                } else {
                    reloadDomains();
                    form.reset();
                }
            }
            domainInput.focus();
        },
    });

    onMount(() => {
        domainInput.focus();
    });

    return (
        <form.Form>
            <TextInput name="domain" label="Domain name" ref={domainInput} />
            <Select
                name="username"
                label="Postmaster / reporting account"
                options={accounts.latest}
            />
            <button>Add new domain</button>
        </form.Form>
    );
};