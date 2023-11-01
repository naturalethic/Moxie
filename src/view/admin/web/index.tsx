import { Component } from "solid-js";
import { Browser } from "~/kit/browser";
import { Handlers } from "./handlers";
import { Redirects } from "./redirects";

export const Web: Component = () => {
    return (
        <div>
            <Browser
                items={[
                    {
                        route: "/admin/web/handlers",
                        label: "Handlers",
                        view: () => <Handlers />,
                    },
                    {
                        route: "/admin/web/redirects",
                        label: "Redirects",
                        view: () => <Redirects />,
                    },
                ]}
            />
        </div>
    );
};
