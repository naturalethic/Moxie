import { Component } from "solid-js";
import { Associative } from "~/kit/Associative";
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

    async function handleSubmit(localpart: string, username: string) {
        await createEmail(username, `${localpart}@${props.domain}`);
        reloadDomainLocalparts(props.domain);
    }

    async function handleDelete(localpart: string) {
        await deleteEmail(`${localpart}@${props.domain}`);
        reloadDomainLocalparts(props.domain);
    }

    return (
        <div>
            <Associative
                keyPlaceholder="Localpart"
                valueOptions={accounts.latest}
                items={localparts.latest}
                submitLabel="Add email"
                onSubmit={handleSubmit}
                onDelete={handleDelete}
            />
        </div>
    );
};
