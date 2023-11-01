import { Component } from "solid-js";
import { Box } from "~/kit/box";
import { Browser } from "~/kit/browser";
import { Accounts } from "./accounts";
import { Domains } from "./domains";
import { Web } from "./web";

export const Admin: Component = () => {
    return (
        <Box class="m-2 p-2" border>
            <Browser
                items={[
                    {
                        route: "/admin/accounts",
                        label: "Accounts",
                        view: () => <Accounts />,
                    },
                    {
                        route: "/admin/domains",
                        label: "Domains",
                        view: () => <Domains />,
                    },
                    {
                        route: "/admin/web",
                        label: "Web",
                        view: () => <Web />,
                    },
                ]}
            />
        </Box>
    );
};
