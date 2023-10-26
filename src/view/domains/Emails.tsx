import { Component } from "solid-js";
import { Associative } from "~/kit/Associative";
import { useToast } from "~/kit/Toast";
import {
    createEmail,
    deleteEmail,
    reloadDomainLocalparts,
    useAccounts,
    useDomainLocalparts,
} from "~/lib/api";

export const Emails: Component<{ domain: string }> = (props) => {
    const localparts = useDomainLocalparts(props.domain);
    const accounts = useAccounts();

    const toast = useToast();

    async function handleSubmit(localpart: string, username: string) {
        await createEmail(username, `${localpart}@${props.domain}`);
        reloadDomainLocalparts(props.domain);
    }

    async function handleDelete(localpart: string) {
        await deleteEmail(`${localpart}@${props.domain}`);
        reloadDomainLocalparts(props.domain);
    }

    async function handleChange(localpart: string, username: string) {
        await deleteEmail(`${localpart}@${props.domain}`);
        await createEmail(username, `${localpart}@${props.domain}`);
        reloadDomainLocalparts(props.domain);
        toast("success", "Domain account updated");
    }
    return (
        <div>
            <Associative
                keyPlaceholder="localpart"
                valueOptions={accounts.latest}
                items={localparts.latest}
                submitLabel="Add email address"
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                onChange={handleChange}
            />
        </div>
    );
};
