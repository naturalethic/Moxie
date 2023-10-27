import { Component, onMount } from "solid-js";
import { minLength, object, string } from "valibot";
import { createForm } from "~/kit/Form";
import { Select } from "~/kit/Select";
import { TextInput } from "~/kit/TextInput";
import { createDomain, reloadDomains, useAccounts } from "~/lib/api";

export const New: Component = () => {
    const accounts = useAccounts();

    let domainInput!: HTMLInputElement;

    const form = createForm(
        object({
            domain: string([minLength(1, "required")]),
            username: string(),
        }),
        async ({ success }) => {
            if (success) {
                const { error } = await createDomain(
                    form.value.domain,
                    form.value.username,
                );
                if (error) {
                    form.error.username = error.split(":")[1];
                } else {
                    // XXX: calling this causes this component to be re-created
                    reloadDomains();
                }
            }
        },
    );

    onMount(() => {
        // XXX: Since the component is re-created as mentioned above, need to
        //      call focus here.  Incidentally, this doesn't focus on the first mount.
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
