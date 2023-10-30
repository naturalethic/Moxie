import { Component } from "solid-js";
import { Box } from "~/kit/Box";
import { Browser } from "~/kit/Browser";
import { Accounts } from "./accounts/Accounts";
import { Domains } from "./domains/Domains";
import { Web } from "./web/Web";

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
