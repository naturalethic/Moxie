import { Component } from "solid-js";
import { Browser } from "~/kit/Browser";
import { Handlers } from "./Handlers";
import { Redirects } from "./Redirects";

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
