import { Component } from "solid-js";
import { Browser } from "~/kit/Browser";
import { Delete } from "./Delete";
import { Emails } from "./Emails";
import { Password } from "./Password";

export const Account: Component<{ username: string }> = (props) => {
    return (
        <div>
            <Browser
                items={[
                    {
                        route: `/admin/accounts/${props.username}/emails`,
                        label: "Emails",
                        view: () => <Emails username={props.username} />,
                    },
                    {
                        route: `/admin/accounts/${props.username}/password`,
                        label: "Password",
                        view: () => <Password username={props.username} />,
                    },
                    {
                        route: `/admin/accounts/${props.username}/delete`,
                        label: "Delete",
                        view: () => <Delete username={props.username} />,
                    },
                ]}
            />
        </div>
    );
};
