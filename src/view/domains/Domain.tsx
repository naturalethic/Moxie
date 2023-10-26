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
                        label: "Emails",
                        view: <Emails domain={props.domain} />,
                    },
                    {
                        label: "DNS Records",
                        view: <Records domain={props.domain} />,
                    },
                    {
                        label: "Delete",
                        view: <Delete domain={props.domain} />,
                    },
                ]}
            />
        </div>
    );
};
