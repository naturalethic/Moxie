import { Component } from "solid-js";
import { Browser } from "../../kit/Browser";
import { Delete } from "./Delete";
import { Emails } from "./Emails";
import { Password } from "./Password";

export const Account: Component<{ username: string }> = (props) => {
    return (
        <div>
            <Browser
                cacheKey="Account"
                items={[
                    {
                        label: "Emails",
                        view: () => <Emails username={props.username} />,
                    },
                    {
                        label: "Password",
                        view: () => <Password username={props.username} />,
                    },
                    {
                        label: "Delete",
                        view: () => <Delete username={props.username} />,
                    },
                ]}
            />
        </div>
    );
};
