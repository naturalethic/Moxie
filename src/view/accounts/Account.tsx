import { Component } from "solid-js";
import { Browser } from "../../kit/Browser";
import { Delete } from "./Delete";
import { Emails } from "./Emails";

export const Account: Component<{ username: string }> = (props) => {
    return (
        <div>
            <Browser
                items={[
                    {
                        label: "Emails",
                        view: <Emails username={props.username} />,
                    },
                    {
                        label: "Password",
                        view: <div>Password</div>,
                    },
                    {
                        label: "Delete",
                        view: <Delete username={props.username} />,
                    },
                ]}
            />
        </div>
    );
};
