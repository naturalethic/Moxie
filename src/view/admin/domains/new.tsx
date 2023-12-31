import { Component, onMount } from "solid-js";
import { Select } from "~/kit/select";
import { TextInput } from "~/kit/text-input";
import { createDomain, reloadDomains, useAccounts } from "~/lib/api/admin";
import { createForm } from "~/lib/form";
import { object, string } from "~/lib/schema";
import { required } from "~/lib/validation";

export const New: Component = () => {
    const accounts = useAccounts();

    let domainInput!: HTMLInputElement;

    const form = createForm({
        schema: object({
            domain: string([required()]),
            username: string(),
        }),
        prototype: {
            domain: "",
            username: "",
        },
        onSubmit: async ({ success }) => {
            if (success) {
                const { error } = await createDomain(
                    form.value.domain!,
                    form.value.username!,
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
                items={accounts.latest}
            />
            <button>Add new domain</button>
        </form.Form>
    );
};
