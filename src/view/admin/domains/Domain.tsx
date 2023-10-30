import { Component } from "solid-js";
import { Browser } from "~/kit/Browser";
import { Delete } from "./Delete";
import { Emails } from "./Emails";
import { Records } from "./Records";

export const Domain: Component<{ domain: string }> = (props) => {
    return (
        <div>
            <Browser
                items={[
                    {
                        route: `/admin/domains/${props.domain}/emails`,
                        label: "Emails",
                        view: () => <Emails domain={props.domain} />,
                    },
                    {
                        route: `/admin/domains/${props.domain}/records`,
                        label: "DNS Records",
                        view: () => <Records domain={props.domain} />,
                    },
                    {
                        route: `/admin/domains/${props.domain}/delete`,
                        label: "Delete",
                        view: () => <Delete domain={props.domain} />,
                    },
                ]}
            />
        </div>
    );
};
